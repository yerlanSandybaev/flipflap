# 🚀 flipflap MVP - Setup Guide

## ✅ What's Been Built

Your flipflap social media application is ready with:

### Core Features
- ✅ User authentication (register/login)
- ✅ AI-powered avatar generation
- ✅ User profiles (Name, Interest, Mood, Profession)
- ✅ Home feed with all users
- ✅ Explore page
- ✅ Search functionality
- ✅ Profile editing
- ✅ Clean black & white UI (ChatGPT/Character.AI style)

### Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- NextAuth v5
- OpenAI API (via Vercel AI SDK)
- Lucide React icons

## 🔧 Setup Instructions

### Step 1: Configure Environment Variables

Open the `.env.local` file and replace the placeholder values:

```env
# 1. MongoDB Atlas URI
# Go to: https://www.mongodb.com/cloud/atlas
# - Create a free cluster (M0)
# - Click "Connect" → "Connect your application"
# - Copy the connection string
# - Replace <password> with your database password
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flipflap?retryWrites=true&w=majority

# 2. NextAuth Secret
# Generate with: openssl rand -base64 32
# Or use any random 32+ character string
NEXTAUTH_SECRET=your_generated_secret_here

# 3. NextAuth URL (keep as is for local development)
NEXTAUTH_URL=http://localhost:3000

# 4. OpenAI API Key
# Go to: https://platform.openai.com/api-keys
# - Create a new secret key
# - Copy and paste it here
OPENAI_API_KEY=sk-proj-...your-key-here
```

### Step 2: Run the Application

```bash
# Navigate to the project directory
cd c:\Users\HP\Desktop\startup\flipflap

# Start the development server
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 3: Test the Application

1. **Register a new account**: Go to http://localhost:3000/register
2. **Create your profile**: Fill in Name, Interest, Mood, Profession
3. **Generate an avatar**: Navigate to "Create" page
4. **Explore other users**: Use Home, Explore, and Search pages

## 📁 Project Structure

```
flipflap/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Authentication
│   │   ├── avatar/generate/route.ts     # AI avatar generation
│   │   ├── profile/route.ts             # Profile management
│   │   ├── register/route.ts            # User registration
│   │   └── users/
│   │       ├── explore/route.ts         # Get all users
│   │       └── search/route.ts          # Search users
│   ├── create/page.tsx                  # Avatar creation page
│   ├── explore/page.tsx                 # Explore users page
│   ├── login/page.tsx                   # Login page
│   ├── profile/page.tsx                 # User profile page
│   ├── register/page.tsx                # Registration page
│   ├── search/page.tsx                  # Search page
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Home page
├── components/
│   ├── AppLayout.tsx                    # Main layout with sidebar
│   ├── Sidebar.tsx                      # Navigation sidebar
│   └── UserCard.tsx                     # User card component
├── lib/
│   └── mongodb.ts                       # MongoDB connection
├── models/
│   └── User.ts                          # User schema
├── types/
│   └── next-auth.d.ts                   # NextAuth types
├── auth.ts                              # NextAuth configuration
├── middleware.ts                        # Route protection
└── .env.local                           # Environment variables
```

## 🎨 Design System

### Colors
- **Background**: White (`#FFFFFF`)
- **Text Primary**: Black (`#000000`)
- **Text Secondary**: Gray (`#6B7280`)
- **Borders**: Light Gray (`#E5E7EB`)
- **Hover**: Gray (`#F3F4F6`)

### Pages
1. **Home** (`/`) - Feed of all users and avatars
2. **Explore** (`/explore`) - Discover new users
3. **Search** (`/search`) - Search by name, interest, profession
4. **Profile** (`/profile`) - View and edit your profile
5. **Create** (`/create`) - Generate AI avatars
6. **Login** (`/login`) - User authentication
7. **Register** (`/register`) - New user registration

## 🔐 Authentication Flow

1. User registers with email, password, and profile info
2. Password is hashed with bcrypt
3. User can log in with credentials
4. NextAuth creates a JWT session
5. Middleware protects all routes except login/register

## 🤖 Avatar Generation

The avatar creation uses:
- OpenAI GPT-4 to generate descriptive text about the avatar
- Dicebear API for placeholder avatar images
- In production, you can integrate DALL-E for actual image generation

To upgrade to DALL-E image generation:
1. Update `/app/api/avatar/generate/route.ts`
2. Use OpenAI's image generation API
3. Store images in cloud storage (AWS S3, Cloudinary, etc.)

## 📝 Next Steps for Enhancement

### Phase 2 Features (After MVP)
- [ ] Avatar-to-avatar interactions
- [ ] Direct messaging
- [ ] Like/reaction system
- [ ] User following
- [ ] Activity feed
- [ ] Image uploads
- [ ] Real-time notifications

### Technical Improvements
- [ ] Add form validation with Zod
- [ ] Implement error boundaries
- [ ] Add loading states
- [ ] Optimize images with Next.js Image
- [ ] Add API rate limiting
- [ ] Implement pagination
- [ ] Add unit tests
- [ ] Set up CI/CD

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if the connection string has the correct password
- Verify the database user has read/write permissions

### NextAuth Errors
- Make sure `NEXTAUTH_SECRET` is set
- Clear cookies and restart the dev server
- Check that `NEXTAUTH_URL` matches your current URL

### Avatar Generation Not Working
- Verify OpenAI API key is valid
- Check OpenAI account has credits
- Ensure the API key has access to GPT-4

## 💡 Tips

- Use MongoDB Compass to view your database
- Check browser console for frontend errors
- Check terminal for backend errors
- Use MongoDB Atlas logs for database issues

## 🚀 Deployment

When ready to deploy:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Environment Variables for Production
Add all variables from `.env.local` to your hosting platform:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (update to production URL)
- `OPENAI_API_KEY`

## 📞 Support

If you encounter any issues:
1. Check the error message in the console
2. Review the setup steps above
3. Verify all environment variables are correct
4. Restart the development server

---

**Your flipflap MVP is ready! 🎉**

Start by registering an account and creating your first avatar!
