import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polly - Create and Share Polls",
  description: "A modern polling application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/logo.svg"
                    alt="Polly Logo"
                    width={32}
                    height={32}
                    className="text-gray-900"
                  />
                  <span className="text-2xl font-bold text-gray-900">Polly</span>
                </Link>
                <nav className="flex items-center space-x-8">
                  <Link href="/polls" className="text-gray-600 hover:text-gray-900 font-medium">My Polls</Link>
                  <Link href="/polls/create" className="text-gray-600 hover:text-gray-900 font-medium">Create Poll</Link>
                  <UserMenu />
                </nav>
              </div>
            </div>
          </header>
          <main className="min-h-screen">{children}</main>
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
              © 2025 Polly. All rights reserved.
            </div>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
