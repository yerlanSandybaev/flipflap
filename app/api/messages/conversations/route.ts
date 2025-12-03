import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';

export const runtime = 'nodejs';

// Get all conversations for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get unique users who have conversations with current user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new (require('mongoose').Types.ObjectId)(session.user.id) },
            { receiverId: new (require('mongoose').Types.ObjectId)(session.user.id) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new (require('mongoose').Types.ObjectId)(session.user.id)] },
              '$receiverId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
    ]);

    const userIds = messages.map((m) => m._id);
    const users = await User.find({ _id: { $in: userIds } }).select('-password');

    const conversations = messages.map((msg) => {
      const user = users.find((u) => u._id.toString() === msg._id.toString());
      return {
        user,
        lastMessage: msg.lastMessage,
      };
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
