import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
      
      {/* Login form placeholder */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="m@example.com" className="w-full p-2 border rounded" />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" className="w-full p-2 border rounded" />
        </div>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </div>
      
      <div className="text-center">
        <p>Don't have an account? <Link href="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  );
}