export async function GET(request, context) {
  try {
    // For Next.js App Router, use context.params
    // Await params before accessing properties
    const params = await context.params;
    const id = params?.id;
    console.log("API GET request received for practice ID:", id);

    // Mock evidence data
    const mockEvidence = [
      { id: 1, title: 'Study on TDD Effectiveness', authors: 'Smith et al.', year: 2022, summary: 'Found 25% reduction in defects when using TDD.' },
      { id: 2, title: 'Case Study: TDD in Enterprise', authors: 'Johnson and Brown', year: 2021, summary: 'Implementation of TDD in enterprise setting showed improved code quality.' }
    ];

    const response = {
      success: true,
      practiceId: id,
      data: mockEvidence
    };
    
    console.log("API returning evidence:", response.data.length);
    return Response.json(response);
  } catch (error) {
    console.error("API GET error:", error);
    return Response.json({
      success: false,
      message: 'Error fetching evidence',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request, context) {
  try {
    // For Next.js App Router, use context.params
    // Await params before accessing properties
    const params = await context.params;
    const id = params?.id;
    
    console.log("API POST request received for practice ID:", id);
    console.log("Context:", context);
    console.log("Params:", params);
    
    if (!id) {
      throw new Error("Practice ID is required");
    }

    const body = await request.json();
    console.log("Received evidence submission:", body);

    // Mock evidence creation
    const newEvidence = {
      id: Math.floor(Math.random() * 1000), // Mock ID generation
      practiceId: id,
      ...body,
      createdAt: new Date().toISOString()
    };

    return Response.json({
      success: true,
      message: 'Evidence submitted successfully',
      data: newEvidence
    });
  } catch (error) {
    console.error("API POST error:", error);
    return Response.json({
      success: false,
      message: 'Failed to submit evidence',
      error: error.message
    }, { status: 400 });
  }
}