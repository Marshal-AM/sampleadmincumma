import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('Cumma');
    
    console.log('Attempting to fetch startups...');
    
    // Added sort by createdAt in descending order (-1)
    const startups = await db.collection('Startups')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log('Fetched startups:', startups.length);
    
    return NextResponse.json(startups);
  } catch (error) {
    console.error('Detailed error fetching startups:', error);
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
  }
}