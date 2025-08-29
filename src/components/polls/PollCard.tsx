import Link from "next/link";

interface PollCardProps {
  id: string;
  title: string;
  question: string;
  optionsCount: number;
  totalVotes: number;
  createdAt: string;
}

export default function PollCard({
  id,
  title,
  question,
  optionsCount,
  totalVotes,
  createdAt,
}: PollCardProps) {
  return (
    <Link href={`/polls/${id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{question}</p>
        
        <div className="space-y-2 mb-4">
          <div className="text-sm text-gray-500">
            {optionsCount} options
          </div>
          <div className="text-sm text-gray-500">
            {totalVotes} total votes
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Created on {createdAt}
        </div>
      </div>
    </Link>
  );
}
