'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { Sparkles } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern digital art');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ avatarUrl: string; description: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/avatar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to generate avatar');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-black" />
          <h1 className="text-4xl font-bold text-black">Create Avatar</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Use AI to generate your unique avatar based on your personality and interests
        </p>

        <form onSubmit={handleGenerate} className="space-y-6 mb-8">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-black mb-2">
              Describe your avatar
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A friendly robot with a warm smile, wearing glasses, surrounded by books and code..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <div>
            <label htmlFor="style" className="block text-sm font-medium text-black mb-2">
              Art style
            </label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="modern digital art">Modern Digital Art</option>
              <option value="anime style">Anime Style</option>
              <option value="cartoon">Cartoon</option>
              <option value="realistic">Realistic</option>
              <option value="minimalist">Minimalist</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Avatar
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Your Avatar</h2>
            <div className="flex items-start gap-8">
              <img
                src={result.avatarUrl}
                alt="Generated avatar"
                className="w-48 h-48 rounded-full border-2 border-black"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">AI Description</p>
                <p className="text-gray-700 mb-6">{result.description}</p>
                <button
                  onClick={() => router.push('/profile')}
                  className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
