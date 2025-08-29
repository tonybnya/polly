import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl leading-tight">
            Create and Share Polls with 
            <span className="text-blue-600">Polly</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            The easiest way to gather opinions and make decisions together. 
            Create beautiful polls in seconds and get instant feedback.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href="/polls" 
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Browse My Polls
            </Link>
            <Link 
              href="/polls/create" 
              className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Create a Poll
            </Link>
          </div>
        </div>
        
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="text-center space-y-4 p-8 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-2xl font-bold text-blue-600">1</div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create a Poll</h2>
            <p className="text-gray-600">Easily create polls with multiple options and customize settings to fit your needs</p>
          </div>
          
          <div className="text-center space-y-4 p-8 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-2xl font-bold text-green-600">2</div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Share with Others</h2>
            <p className="text-gray-600">Share your poll with friends, colleagues, or the public via link or social media</p>
          </div>
          
          <div className="text-center space-y-4 p-8 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-2xl font-bold text-purple-600">3</div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Collect Results</h2>
            <p className="text-gray-600">View real-time results and analyze the responses with detailed statistics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
