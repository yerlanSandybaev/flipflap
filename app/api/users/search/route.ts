import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    await connectDB();

    const users = await User.find({
      _id: { $ne: session.user.id },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { interest: { $regex: query, $options: 'i' } },
        { profession: { $regex: query, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(20);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
