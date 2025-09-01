import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

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

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Poll</h1>
        <Link href="/polls">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <div className="space-y-6 border rounded-lg p-6 shadow-sm">
        <div className="space-y-2">
          <label htmlFor="title" className="font-medium">Poll Title</label>
          <Input 
            id="title" 
            name="title" 
            type="text" 
            defaultValue={poll.title}
            placeholder="Enter your question" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="font-medium">Description (Optional)</label>
          <textarea 
            id="description" 
            name="description" 
            rows={3} 
            className="w-full p-2 border rounded" 
            placeholder="Provide additional context for your poll"
            defaultValue={poll.description || ""}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Options</label>
          <div className="space-y-3">
            {poll.poll_options?.map((option: { id: string; text: string }, index: number) => (
              <div key={option.id} className="flex gap-2 items-center">
                <Input
                  placeholder={`Option ${index + 1}`}
                  defaultValue={option.text}
                  name="options"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="link" className="p-0">
            + Add Option
          </Button>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link href="/polls">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-blue-600 text-white">
            Update Poll
          </Button>
        </div>
      </div>
    </div>
  );
}
