/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * API route for proxying moderation actions (approve/reject) to the backend server.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const { id, action } = params;

    // Validate the action
    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Backend server URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    // Forward the request to your backend
    const response = await fetch(`${API_URL}/api/moderation/${id}/${action}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await response.json();

    // If the response isn't ok, return an error
    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

    // Return the response to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process moderation request' },
      { status: 500 }
    );
  }
}