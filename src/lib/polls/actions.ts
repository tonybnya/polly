"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createPoll(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

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
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

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
    throw new Error("Poll not found or you don't have permission to delete it");
  }

  // Delete the poll (cascade will handle poll_options and votes)
  const { error: deleteError } = await supabase
    .from("polls")
    .delete()
    .eq("id", pollId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  revalidatePath("/polls");
  return { success: true };
}
