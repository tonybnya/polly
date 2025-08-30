import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
          {/* Logo and branding */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <Image
                src="/logo.svg"
                alt="Polly Logo"
                width={40}
                height={40}
                className="text-gray-900"
              />
              <span className="text-3xl font-bold text-gray-900">Polly</span>
            </Link>
          </div>
          
          {/* Auth form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
