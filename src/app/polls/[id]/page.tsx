export default function PollDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Sample Poll {params.id}</h1>
      <p className="text-gray-500 mb-6">This is a placeholder for poll description</p>
      
      {/* Poll options placeholder */}
      <div className="space-y-4 border rounded-lg p-6 shadow-sm">
        <div className="space-y-3">
          {['Option A', 'Option B', 'Option C'].map((option, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50">
              <input type="radio" id={`option-${index}`} name="poll-option" />
              <label htmlFor={`option-${index}`} className="flex-1">{option}</label>
              <span className="text-sm text-gray-400">32%</span>
            </div>
          ))}
        </div>
        
        <div className="pt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Vote</button>
        </div>
        
        <div className="pt-2 text-sm text-gray-500">
          <p>Total votes: 100</p>
        </div>
      </div>
      
      <div className="mt-6">
        <a href="/polls" className="text-blue-600 hover:underline">← Back to all polls</a>
      </div>
    </div>
  );
}