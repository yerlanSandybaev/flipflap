'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Edit2 } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  name: string;
  interest: string;
  mood: string;
  profession: string;
  avatarUrl?: string;
  avatarPrompt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    interest: '',
    mood: '',
    profession: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setUser(data.user);
      setFormData({
        name: data.user.name,
        interest: data.user.interest || '',
        mood: data.user.mood || '',
        profession: data.user.profession || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setUser(data.user);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-black">Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-8">
          <div className="flex items-start gap-8 mb-8">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-32 h-32 rounded-full border-2 border-black"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-black">
                <span className="text-4xl font-bold text-gray-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Profession</label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Interest</label>
                    <input
                      type="text"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Mood</label>
                    <input
                      type="text"
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-black">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  {user.profession && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Profession</p>
                      <p className="text-lg text-black">{user.profession}</p>
                    </div>
                  )}
                  {user.interest && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Interest</p>
                      <p className="text-lg text-black">{user.interest}</p>
                    </div>
                  )}
                  {user.mood && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Mood</p>
                      <p className="text-lg text-black">{user.mood}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {user.avatarPrompt && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Avatar Description</p>
              <p className="text-gray-700">{user.avatarPrompt}</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
