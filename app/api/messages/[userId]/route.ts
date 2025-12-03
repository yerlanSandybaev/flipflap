import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    await connectDB();

    const messages = await Message.find({
      $or: [
        { senderId: session.user.id, receiverId: userId },
        { senderId: userId, receiverId: session.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name avatarUrl')
      .populate('receiverId', 'name avatarUrl');

    // Mark messages as read
    await Message.updateMany(
      { senderId: userId, receiverId: session.user.id, read: false },
      { read: true }
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
