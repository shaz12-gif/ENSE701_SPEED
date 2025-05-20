export async function GET(request) {
  console.log("Fetching all practices");
  
  try {
    // Mock data for practices
    const mockPractices = [
      { id: 1, name: 'Test Driven Development', description: 'Writing tests before implementing code' },
      { id: 2, name: 'Pair Programming', description: 'Two developers working together on the same code' },
      { id: 3, name: 'Continuous Integration', description: 'Frequently merging code changes into a central repository' },
      { id: 4, name: 'Code Reviews', description: 'Systematic examination of code by peers' },
      { id: 5, name: 'Agile Development', description: 'Iterative approach to software development' }
    ];

    console.log("Returning practices:", mockPractices.length);
    
    return Response.json({
      success: true,
      data: mockPractices
    });
  } catch (error) {
    console.error("Error in GET /api/practices:", error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch practices',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Creating new practice:", body);

    // Mock creating a new practice
    const newPractice = {
      id: Math.floor(Math.random() * 1000), // Mock ID generation
      ...body
    };

    return Response.json({
      success: true,
      message: 'Practice created successfully',
      data: newPractice
    });
  } catch (error) {
    console.error("Error in POST /api/practices:", error);
    
    return Response.json({
      success: false,
      message: 'Failed to create practice',
      error: error.message
    }, { status: 400 });
  }
}