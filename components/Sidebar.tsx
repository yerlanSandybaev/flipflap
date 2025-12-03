'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, User, PlusCircle, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/explore', icon: Compass, label: 'Explore' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/create', icon: PlusCircle, label: 'Create' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-black">flipflap</h1>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full"
        >
          <LogOut className="w-6 h-6" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
