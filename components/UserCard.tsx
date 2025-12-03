import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    interest: string;
    mood: string;
    profession: string;
    avatarUrl?: string;
    avatarPrompt?: string;
  };
  onClick?: () => void;
}

export default function UserCard({ user, onClick }: UserCardProps) {
  const router = useRouter();

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/chat?user=${user._id}`);
  };

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
    >
      <div className="flex items-start gap-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-black"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-black">
            <span className="text-2xl font-bold text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-xl font-bold text-black">{user.name}</h3>
          {user.profession && (
            <p className="text-sm text-gray-600 mt-1">{user.profession}</p>
          )}
          {user.interest && (
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Interest:</span> {user.interest}
            </p>
          )}
          {user.mood && (
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Mood:</span> {user.mood}
            </p>
          )}
          {user.avatarPrompt && (
            <p className="text-xs text-gray-500 mt-3 italic line-clamp-2">
              {user.avatarPrompt}
            </p>
          )}
          <button
            onClick={handleChatClick}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
