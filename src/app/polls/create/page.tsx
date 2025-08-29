export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>
      
      {/* Create poll form placeholder */}
      <div className="space-y-6 border rounded-lg p-6 shadow-sm">
        <div className="space-y-2">
          <label htmlFor="title" className="font-medium">Poll Title</label>
          <input id="title" type="text" placeholder="Enter your question" className="w-full p-2 border rounded" />
        </div>
        
        <div className="space-y-2">
          <label className="font-medium">Options</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input type="text" placeholder="Option 1" className="flex-1 p-2 border rounded" />
              <button className="text-red-500">Remove</button>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Option 2" className="flex-1 p-2 border rounded" />
              <button className="text-red-500">Remove</button>
            </div>
          </div>
          <button className="text-blue-600 mt-2">+ Add Option</button>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="font-medium">Description (Optional)</label>
          <textarea id="description" rows={3} className="w-full p-2 border rounded" placeholder="Provide additional context for your poll"></textarea>
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <a href="/polls" className="px-4 py-2 border rounded">Cancel</a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Poll</button>
        </div>
      </div>
    </div>
  );
}