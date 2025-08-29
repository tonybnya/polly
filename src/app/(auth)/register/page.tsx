import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information to create an account
        </p>
      </div>
      
      {/* Register form placeholder */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="John Doe" className="w-full p-2 border rounded" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="m@example.com" className="w-full p-2 border rounded" />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" className="w-full p-2 border rounded" />
        </div>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </div>
      
      <div className="text-center">
        <p>Already have an account? <Link href="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}