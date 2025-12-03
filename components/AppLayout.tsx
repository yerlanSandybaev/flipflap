'use client';

import { SessionProvider } from 'next-auth/react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </SessionProvider>
  );
}
