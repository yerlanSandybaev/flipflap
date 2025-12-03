# flipflap

A social media web application where users create AI-generated avatars and interact with other users through their unique digital personas.

## Features

- 🎨 **AI-Generated Avatars** - Create unique avatars using OpenAI's GPT-4
- 👤 **User Profiles** - Complete profiles with Name, Interest, Mood, and Profession
- 🔐 **Authentication** - Secure login and registration with NextAuth
- 🏠 **Home Feed** - View all users and their avatars
- 🔍 **Search** - Find users by name, interest, or profession
- 🧭 **Explore** - Discover new users and avatars
- ✏️ **Profile Editing** - Update your profile information anytime

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth v5
- **AI Integration**: OpenAI GPT-4 via Vercel AI SDK
- **UI Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd flipflap
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following:

```env
# MongoDB Atlas Connection
MONGODB_URI=your_mongodb_atlas_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# OpenAI API Key for Avatar Generation
OPENAI_API_KEY=your_openai_api_key_here
```

**How to get these credentials:**

- **MongoDB Atlas URI**: 
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free cluster
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string and replace `<password>` with your database password

- **NextAuth Secret**: Generate a random secret:
  ```bash
  openssl rand -base64 32
  ```

- **OpenAI API Key**: 
  1. Go to [OpenAI Platform](https://platform.openai.com/)
  2. Navigate to API keys section
  3. Create a new secret key

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
flipflap/
├── app/
│   ├── api/           # API routes
│   │   ├── auth/      # NextAuth endpoints
│   │   ├── avatar/    # Avatar generation
│   │   ├── profile/   # User profile management
│   │   └── users/     # User search and explore
│   ├── create/        # Avatar creation page
│   ├── explore/       # Explore users page
│   ├── login/         # Login page
│   ├── profile/       # User profile page
│   ├── register/      # Registration page
│   ├── search/        # Search page
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/
│   ├── AppLayout.tsx  # Main app layout with sidebar
│   ├── Sidebar.tsx    # Navigation sidebar
│   └── UserCard.tsx   # User avatar card component
├── lib/
│   └── mongodb.ts     # MongoDB connection
├── models/
│   └── User.ts        # User schema
├── types/
│   └── next-auth.d.ts # NextAuth type definitions
├── auth.ts            # NextAuth configuration
└── middleware.ts      # Route protection
```

## Usage

### Registration
1. Navigate to `/register`
2. Fill in email, password, name, and optional profile fields
3. Click "Create account"

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign in"

### Create Avatar
1. Go to the "Create" page
2. Describe your desired avatar in the text area
3. Select an art style
4. Click "Generate Avatar"
5. Your avatar will be created and saved to your profile

### Explore & Search
- **Home**: View all users and their avatars
- **Explore**: Discover users from the community
- **Search**: Find specific users by keywords

### Profile Management
- Click "Profile" in the sidebar
- Click "Edit" to update your information
- Your avatar is displayed prominently

## Design Philosophy

The interface follows a clean, minimal black and white design inspired by ChatGPT and Character.AI:
- Simple, distraction-free layout
- High contrast black and white color scheme
- Clear typography and spacing
- Focus on content and user avatars

## API Endpoints

- `POST /api/register` - Create new user account
- `POST /api/auth/signin` - User authentication
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile
- `POST /api/avatar/generate` - Generate AI avatar
- `GET /api/users/explore` - Get all users
- `GET /api/users/search?q=query` - Search users

## Future Enhancements

- Direct messaging between users
- Avatar-to-avatar AI conversations
- Reaction and like system
- User following/followers
- Avatar customization options
- Image generation with DALL-E
- Real-time notifications
- Mobile app version

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js and AI
