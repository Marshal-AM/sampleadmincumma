import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = "force-dynamic"; // Prevent static generation

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('Cumma');
    
    const facilities = await db
      .collection('Facilities')
      .find({ status: 'pending' })
      .toArray();

    return NextResponse.json(facilities);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    console.log('Received PUT request');

    // Check content type
    console.log('Headers:', request.headers);
    
    const bodyText = await request.text();
    console.log('Raw Body:', bodyText);

    // Try parsing JSON
    const { facilityId, status } = JSON.parse(bodyText);

    if (!facilityId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('Cumma');

    const result = await db.collection('Facilities').updateOne(
      { _id: new ObjectId(facilityId) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes were made' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `Facility status updated to ${status}`
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
