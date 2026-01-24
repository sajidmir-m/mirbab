'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '@/components/ui/Chatbot';
import Snowfall from '@/components/ui/Snowfall';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Snowfall />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

