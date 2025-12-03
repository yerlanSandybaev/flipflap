'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import UserCard from '@/components/UserCard';

interface User {
  _id: string;
  name: string;
  interest: string;
  mood: string;
  profession: string;
  avatarUrl?: string;
  avatarPrompt?: string;
}

export default function ExplorePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/explore');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-2">Explore</h1>
        <p className="text-gray-600 mb-8">Discover avatars from around the community</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <p className="text-gray-600">No users to explore yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
