import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from '@clerk/nextjs';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SupplierHut Solutions - Bangladesh Problem & Income Platform",
  description: "Discover validated problems affecting Bangladesh, analyze market viability, research real customer demand, and participate in structured earning opportunities and paid challenges.",
  openGraph: {
    title: "SupplierHut Solutions - Bangladesh Problem & Income Platform",
    description: "Discover validated problems affecting Bangladesh, analyze market viability, research real customer demand, and participate in structured earning opportunities and paid challenges.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.className} bg-slate-50 text-slate-900 flex flex-col min-h-screen antialiased`}>
        <Suspense fallback={<header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16" />}>
          <Navbar />
        </Suspense>
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );

  // If Clerk Publishable Key is configured in environment, enable ClerkProvider
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  // Otherwise run in seamless standalone demo/platform session mode without crashing
  return content;
}
