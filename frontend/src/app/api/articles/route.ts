/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * API route for proxying article requests to the backend server.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    // Backend server URL from environment variable or hardcoded for now
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Build the URL to forward to your backend
    const url = `${API_URL}/api/articles${status ? `?status=${status}` : ''}`;
    
    console.log('Proxying request to:', url);
    
    // Forward the request to your backend
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Prevent caching
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}