import { createPoll } from "@/lib/polls/actions";
import OptionsInput from "@/components/polls/OptionsInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>
      
      <form action={createPoll} className="space-y-6 border rounded-lg p-6 shadow-sm">
        <div className="space-y-2">
          <label htmlFor="title" className="font-medium">Poll Title</label>
          <Input id="title" name="title" type="text" placeholder="Enter your question" required />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Options</label>
          <OptionsInput />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="font-medium">Description (Optional)</label>
          <textarea id="description" name="description" rows={3} className="w-full p-2 border rounded" placeholder="Provide additional context for your poll"></textarea>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <a href="/polls" className="px-4 py-2 border rounded">Cancel</a>
          <Button type="submit" className="bg-blue-600 text-white">Create Poll</Button>
        </div>
      </form>
    </div>
  );
}