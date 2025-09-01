"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function createPoll(formData: FormData) {
  const supabase = createServerSupabaseClient();

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
  redirect(`/polls/${poll.id}`);
}
