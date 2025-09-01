"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updatePoll } from "@/lib/polls/actions";

interface PollOption {
  id: string;
  text: string;
  position: number;
}

interface Poll {
  id: string;
  title: string;
  description: string | null;
  poll_options: PollOption[];
}

interface EditPollFormProps {
  poll: Poll;
}

export default function EditPollForm({ poll }: EditPollFormProps) {
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description || "");
  const [options, setOptions] = useState<string[]>(
    poll.poll_options.map((opt) => opt.text)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      toast.error("A poll must have at least 2 options");
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    if (!title.trim()) {
      toast.error("Poll title is required");
      return;
    }

    const validOptions = options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      toast.error("At least 2 options are required");
      return;
    }

    const uniqueOptions = Array.from(new Set(validOptions));
    if (uniqueOptions.length < 2) {
      toast.error("Options must be unique");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      
      uniqueOptions.forEach(option => {
        formData.append("options", option);
      });

      await updatePoll(poll.id, formData);
      toast.success("Poll updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update poll");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border rounded-lg p-6 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="title" className="font-medium">
          Poll Title
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your question"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="font-medium">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full p-2 border rounded"
          placeholder="Provide additional context for your poll"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Options</label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="link"
          onClick={addOption}
          className="p-0"
          disabled={options.length >= 10} // Reasonable limit
        >
          + Add Option
        </Button>
        {options.length >= 10 && (
          <p className="text-sm text-gray-500">Maximum 10 options allowed</p>
        )}
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Poll"}
        </Button>
      </div>
    </form>
  );
}
