import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('modulux')
    
    // Test the connection
    const collections = await db.listCollections().toArray()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully!',
      collections: collections.map(col => col.name)
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
