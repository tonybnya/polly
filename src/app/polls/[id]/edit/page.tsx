import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditPollForm from "@/components/polls/EditPollForm";

interface EditPollPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  const resolvedParams = await params;
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Fetch the poll and its options
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options (*)
    `)
    .eq("id", resolvedParams.id)
    .eq("created_by", user.id)
    .single();

  if (pollError || !poll) {
    notFound();
  }

  // Sort poll options by position
  const sortedPoll = {
    ...poll,
    poll_options: poll.poll_options.sort((a: any, b: any) => a.position - b.position),
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Poll</h1>
        <Link href="/polls">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <EditPollForm poll={sortedPoll} />
    </div>
  );
}
