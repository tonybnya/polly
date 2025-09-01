"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { voteOnPoll } from "@/lib/polls/actions";
import { formatDistanceToNow } from "date-fns";

interface PollOption {
  id: string;
  text: string;
  position: number;
}

interface Vote {
  id: string;
  option_id: string;
  voter_id: string;
}

interface PollDetailProps {
  poll: {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    created_by: string;
    poll_options: PollOption[];
    votes: Vote[];
  };
  userVote?: Vote | null;
  userId?: string;
}

export default function PollDetail({ poll, userVote, userId }: PollDetailProps) {
  const [selectedOption, setSelectedOption] = useState<string>(userVote?.option_id || "");
  const [hasVoted, setHasVoted] = useState<boolean>(!!userVote);
  const [isPending, startTransition] = useTransition();

  // Calculate vote counts for each option
  const voteResults = poll.poll_options.map((option) => {
    const voteCount = poll.votes.filter((vote) => vote.option_id === option.id).length;
    const percentage = poll.votes.length > 0 ? (voteCount / poll.votes.length) * 100 : 0;
    
    return {
      ...option,
      voteCount,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    };
  });

  const totalVotes = poll.votes.length;
  const isOwner = userId === poll.created_by;

  const handleVote = async () => {
    if (!selectedOption) {
      toast.error("Please select an option to vote");
      return;
    }

    startTransition(async () => {
      try {
        await voteOnPoll(poll.id, selectedOption);
        setHasVoted(true);
        toast.success(hasVoted ? "Vote updated successfully!" : "Vote submitted successfully!");
        
        // Refresh the page to show updated results
        window.location.reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to submit vote");
        console.error("Voting error:", error);
      }
    });
  };

  const handleOptionSelect = (optionId: string) => {
    if (!hasVoted || userVote) {
      setSelectedOption(optionId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Poll Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{poll.title}</h1>
        {poll.description && (
          <p className="text-gray-600 text-lg">{poll.description}</p>
        )}
        <p className="text-sm text-gray-500">
          Created {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
        </p>
      </div>

      {/* Voting Options */}
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {hasVoted ? "Results" : "Cast Your Vote"}
          </h2>

          <div className="space-y-3">
            {voteResults.map((option) => (
              <div
                key={option.id}
                className={`relative overflow-hidden border rounded-lg transition-all duration-200 ${
                  !hasVoted && selectedOption === option.id
                    ? "border-blue-500 bg-blue-50"
                    : hasVoted
                    ? "border-gray-200"
                    : "border-gray-200 hover:border-gray-300 cursor-pointer"
                }`}
                onClick={() => !hasVoted && handleOptionSelect(option.id)}
              >
                {/* Vote result background bar */}
                {hasVoted && (
                  <div
                    className="absolute inset-0 bg-blue-100 transition-all duration-500 ease-out"
                    style={{ width: `${option.percentage}%` }}
                  />
                )}
                
                <div className="relative flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {!hasVoted ? (
                      <input
                        type="radio"
                        id={`option-${option.id}`}
                        name="poll-option"
                        checked={selectedOption === option.id}
                        onChange={() => handleOptionSelect(option.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                    ) : (
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          userVote?.option_id === option.id
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {userVote?.option_id === option.id && (
                          <div className="h-full w-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    )}
                    
                    <label
                      htmlFor={`option-${option.id}`}
                      className={`text-base ${
                        hasVoted ? "font-medium" : "cursor-pointer"
                      } ${
                        userVote?.option_id === option.id ? "text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {option.text}
                    </label>
                  </div>
                  
                  {hasVoted && (
                    <div className="text-sm text-gray-600 font-medium">
                      {option.voteCount} vote{option.voteCount !== 1 ? "s" : ""} ({option.percentage}%)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Vote Button */}
          {!hasVoted && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleVote}
                disabled={!selectedOption || isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isPending ? "Submitting..." : "Submit Vote"}
              </Button>
            </div>
          )}

          {/* Change Vote Button for existing voters */}
          {hasVoted && userVote && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => setHasVoted(false)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Change My Vote
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Vote Summary */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total votes: <span className="font-semibold text-gray-900">{totalVotes}</span></span>
          {hasVoted && userVote && (
            <span className="text-blue-600">✓ You voted for: {voteResults.find(opt => opt.id === userVote.option_id)?.text}</span>
          )}
        </div>
        
        {isOwner && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">👑 You created this poll</span>
          </div>
        )}
      </div>
    </div>
  );
}
