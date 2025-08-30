import PollCard from "@/components/polls/PollCard";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Mock data matching the screenshot
const mockPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    question: "What programming language do you prefer to use?",
    optionsCount: 5,
    totalVotes: 42,
    createdAt: "10/15/2023",
  },
  {
    id: "2",
    title: "Best Frontend Framework",
    question: "Which frontend framework do you think is the best?",
    optionsCount: 4,
    totalVotes: 38,
    createdAt: "10/10/2023",
  },
  {
    id: "3",
    title: "Preferred Database",
    question: "What database do you prefer to work with?",
    optionsCount: 5,
    totalVotes: 27,
    createdAt: "10/5/2023",
  },
];

export default function PollsPage() {
  return (
    <ProtectedRoute>
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
        {mockPolls.map((poll) => (
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

      {mockPolls.length === 0 && (
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
