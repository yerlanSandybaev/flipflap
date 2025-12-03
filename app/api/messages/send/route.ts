import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
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

    const { receiverId, message } = await req.json();

    if (!receiverId || !message) {
      return NextResponse.json(
        { error: 'Receiver ID and message are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Save user's message
    const newMessage = await Message.create({
      senderId: session.user.id,
      receiverId,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name avatarUrl')
      .populate('receiverId', 'name avatarUrl');

    // Get receiver's profile for AI response
    const receiver = await User.findById(receiverId);
    
    if (receiver) {
      // Generate AI response based on receiver's profile
      const aiPrompt = `You are ${receiver.name}, a person with the following profile:
- Profession: ${receiver.profession || 'Not specified'}
- Interests: ${receiver.interest || 'Not specified'}
- Current Mood: ${receiver.mood || 'neutral'}
- Avatar Description: ${receiver.avatarPrompt || 'A friendly person'}

Someone just sent you this message: "${message}"

Respond naturally as this person would, considering their profession, interests, and mood. Keep the response conversational, friendly, and under 100 words. Stay in character based on the profile.`;

      // Generate AI response asynchronously
      generateText({
        model: openai('gpt-4o-mini'),
        prompt: aiPrompt,
        maxTokens: 150,
      }).then(async ({ text: aiResponse }) => {
        // Save AI response after a short delay
        setTimeout(async () => {
          await Message.create({
            senderId: receiverId,
            receiverId: session.user.id,
            message: aiResponse,
          });
        }, 2000); // 2-second delay to simulate typing
      }).catch(error => {
        console.error('AI response generation failed:', error);
      });
    }

    return NextResponse.json({ message: populatedMessage }, { status: 201 });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
