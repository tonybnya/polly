"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createActionSupabaseClient } from "@/lib/supabase-actions";

export async function createPoll(formData: FormData) {
  const supabase = await createActionSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const rawTitle = formData.get("title");
  const rawDescription = formData.get("description");
  const rawOptions = formData.getAll("options");

  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  const description =
    typeof rawDescription === "string" ? rawDescription.trim() : "";
  const options = rawOptions
    .map((opt) => (typeof opt === "string" ? opt.trim() : ""))
    .filter((opt) => opt.length > 0);

  // Basic validation
  if (!title) {
    throw new Error("Title is required");
  }

  // Ensure at least 2 distinct options
  const distinctOptions = Array.from(new Set(options));
  if (distinctOptions.length < 2) {
    throw new Error("At least two unique options are required");
  }

  // Create poll
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({
      title,
      description: description || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (pollError || !poll) {
    throw new Error(pollError?.message || "Failed to create poll");
  }

  // Create poll options
  const { error: optionsError } = await supabase.from("poll_options").insert(
    distinctOptions.map((text, index) => ({
      poll_id: poll.id,
      text,
      position: index,
    }))
  );

  if (optionsError) {
    throw new Error(optionsError.message);
  }

  revalidatePath("/polls");
  redirect("/polls?success=true");
}

export async function deletePoll(pollId: string) {
  const supabase = await createActionSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify the poll belongs to the user
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("id, created_by")
    .eq("id", pollId)
    .eq("created_by", user.id)
    .single();

  if (pollError) {
    throw new Error(`Database error: ${pollError.message}`);
  }

  if (!poll) {
    throw new Error("Poll not found or you don't have permission to delete it");
  }

  // Delete the poll (cascade will handle poll_options and votes)
  const { error: deleteError } = await supabase
    .from("polls")
    .delete()
    .eq("id", pollId);

  if (deleteError) {
    throw new Error(`Failed to delete poll: ${deleteError.message}`);
  }

  revalidatePath("/polls");
  return { success: true };
}

export async function voteOnPoll(pollId: string, optionId: string) {
  const supabase = await createActionSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in to vote");
  }

  // Check if user has already voted on this poll
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("voter_id", user.id)
    .single();

  if (existingVote) {
    // Update existing vote
    const { error: updateError } = await supabase
      .from("votes")
      .update({ option_id: optionId })
      .eq("id", existingVote.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    // Create new vote
    const { error: insertError } = await supabase
      .from("votes")
      .insert({
        poll_id: pollId,
        option_id: optionId,
        voter_id: user.id,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  revalidatePath(`/polls/${pollId}`);
  return { success: true };
}

export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createActionSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify the poll belongs to the user
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("id")
    .eq("id", pollId)
    .eq("created_by", user.id)
    .single();

  if (pollError || !poll) {
    throw new Error("Poll not found or you don't have permission to edit it");
  }

  const rawTitle = formData.get("title");
  const rawDescription = formData.get("description");
  const rawOptions = formData.getAll("options");

  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  const description =
    typeof rawDescription === "string" ? rawDescription.trim() : "";
  const options = rawOptions
    .map((opt) => (typeof opt === "string" ? opt.trim() : ""))
    .filter((opt) => opt.length > 0);

  // Basic validation
  if (!title) {
    throw new Error("Title is required");
  }

  // Ensure at least 2 distinct options
  const distinctOptions = Array.from(new Set(options));
  if (distinctOptions.length < 2) {
    throw new Error("At least two unique options are required");
  }

  try {
    // Update poll metadata
    const { error: updatePollError } = await supabase
      .from("polls")
      .update({
        title,
        description: description || null,
      })
      .eq("id", pollId);

    if (updatePollError) {
      throw new Error(updatePollError.message);
    }

    // Delete votes first (must be done before deleting options due to FK constraint)
    const { error: deleteVotesError } = await supabase
      .from("votes")
      .delete()
      .eq("poll_id", pollId);

    if (deleteVotesError) {
      throw new Error(`Failed to delete existing votes: ${deleteVotesError.message}`);
    }

    // Delete ALL existing options for this poll
    const { error: deleteOptionsError } = await supabase
      .from("poll_options")
      .delete()
      .eq("poll_id", pollId);

    if (deleteOptionsError) {
      throw new Error(`Failed to delete existing options: ${deleteOptionsError.message}`);
    }

    // Create new options
    const newOptions = distinctOptions.map((text, index) => ({
      poll_id: pollId,
      text: text.trim(),
      position: index,
    }));

    const { error: insertOptionsError } = await supabase
      .from("poll_options")
      .insert(newOptions);

    if (insertOptionsError) {
      throw new Error(`Failed to create new options: ${insertOptionsError.message}`);
    }

    // Clear cache and redirect
    revalidatePath(`/polls/${pollId}`);
    revalidatePath("/polls");
    redirect(`/polls/${pollId}`);
  } catch (error) {
    // If anything fails, re-throw the error
    throw error;
  }
}
