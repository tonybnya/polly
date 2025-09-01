import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import PollDetail from "@/components/polls/PollDetail";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface PollDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // Cannot set cookies in Server Components
        },
        remove() {
          // Cannot remove cookies in Server Components
        },
      },
    }
  );
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Fetch poll with options and all votes
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      created_at,
      created_by,
      poll_options (
        id,
        text,
        position
      ),
      votes (
        id,
        option_id,
        voter_id
      )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (pollError || !poll) {
    notFound();
  }

  // Check if current user has voted
  const userVote = poll.votes.find((vote) => vote.voter_id === user.id) || null;

  // Sort poll options by position
  const sortedPoll = {
    ...poll,
    poll_options: poll.poll_options.sort((a, b) => a.position - b.position),
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/polls">
            <Button variant="ghost" className="gap-2">
              ← Back to all polls
            </Button>
          </Link>
        </div>
        
        {/* Poll Detail Component */}
        <PollDetail 
          poll={sortedPoll}
          userVote={userVote}
          userId={user.id}
        />
        
        {/* Poll Actions (for owners) */}
        {user.id === poll.created_by && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <Link href={`/polls/${poll.id}/edit`}>
                <Button variant="outline">
                  Edit Poll
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
