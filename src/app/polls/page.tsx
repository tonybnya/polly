import PollCard from "@/components/polls/PollCard";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import SuccessNotification from "@/components/polls/SuccessNotification";

interface Poll {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  poll_options: Array<{ id: string; text: string }>;
  votes: Array<{ id: string }>;
}

export default async function PollsPage() {
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

  // Fetch user's polls with options and vote counts
  const { data: polls, error: pollsError } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      created_at,
      poll_options (id, text),
      votes (id)
    `)
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (pollsError) {
    console.error("Error fetching polls:", pollsError);
  }

  const formattedPolls = polls?.map((poll: any) => ({
    id: poll.id,
    title: poll.title,
    question: poll.description || poll.title,
    optionsCount: poll.poll_options?.length || 0,
    totalVotes: poll.votes?.length || 0,
    createdAt: poll.created_at, // Pass raw ISO date string
  })) || [];

  return (
    <ProtectedRoute>
      <SuccessNotification />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Polls</h1>
          <Link
            href="/polls/create"
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Create New Poll
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formattedPolls.map((poll) => (
            <PollCard
              key={poll.id}
              id={poll.id}
              title={poll.title}
              question={poll.question}
              optionsCount={poll.optionsCount}
              totalVotes={poll.totalVotes}
              createdAt={poll.createdAt}
            />
          ))}
        </div>

        {formattedPolls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't created any polls yet.</p>
            <Link
              href="/polls/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Poll
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
