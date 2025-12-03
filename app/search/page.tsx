'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import UserCard from '@/components/UserCard';
import { Search as SearchIcon } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  interest: string;
  mood: string;
  profession: string;
  avatarUrl?: string;
  avatarPrompt?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-2">Search</h1>
        <p className="text-gray-600 mb-8">Find users by name, interest, or profession</p>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for users..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : searched && users.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <p className="text-gray-600">No users found matching "{query}"</p>
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Enter a search query to find users</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
