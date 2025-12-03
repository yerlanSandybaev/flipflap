import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, style } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    await connectDB();

    // Generate avatar description using AI
    const avatarPrompt = `Create a detailed avatar description based on: ${prompt}. Style: ${style || 'modern digital art'}. Describe the avatar's appearance, colors, and key features in 2-3 sentences.`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: avatarPrompt,
    });

    // In a real implementation, you would call DALL-E or similar image generation API
    // For MVP, we'll store the prompt and generated description
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.id)}`;

    await User.findByIdAndUpdate(session.user.id, {
      avatarUrl,
      avatarPrompt: text,
    });

    return NextResponse.json({
      avatarUrl,
      description: text,
    });
  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 }
    );
  }
}
