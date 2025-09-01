"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { deletePoll } from "@/lib/polls/actions";

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePoll(id);
      toast.success("Poll deleted successfully!");
      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete poll");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/polls/${id}/edit`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <Link href={`/polls/${id}`} className="block">
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
      </Link>
      
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
