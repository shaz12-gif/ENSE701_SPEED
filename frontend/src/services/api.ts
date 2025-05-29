/* eslint-disable @typescript-eslint/no-explicit-any */
// API service for communicating with the backend

// Article API functions
export const getArticles = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:3001/api/articles?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return await response.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: String(error) };
    }
  }
};

export const submitArticle = async (articleData: any) => {
  try {
    const response = await fetch('http://localhost:3001/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData)
    });
    if (!response.ok) throw new Error('Failed to submit article');
    return await response.json();
  } catch (error) {
    console.error("Error submitting article:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: String(error) };
    }
  }
};

// Evidence API functions
export const getEvidence = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:3001/api/evidence?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch evidence');
    return await response.json();
  } catch (error) {
    console.error("Error fetching evidence:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: String(error) };
    }
  }
};

export const submitEvidence = async (evidenceData: { articleId: string; practiceId: string; claim: string | undefined; supportsClaim: boolean; title: string; source: string; year: number; description: string; }) => {
  try {
    console.log('Submitting evidence:', evidenceData);
    
    const response = await fetch('http://localhost:3001/api/evidence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evidenceData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || 'Failed to submit evidence');
    }
    
    const result = await response.json();
    console.log('Evidence submission result:', result);
    return result;
  } catch (error) {
    console.error("Error submitting evidence:", error);
    throw error;
  }
}

// Rating API functions
export const submitRating = async (contentId: any, contentType: any, value: any) => {
  try {
    const response = await fetch('http://localhost:3001/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, contentType, value })
    });
    if (!response.ok) throw new Error('Failed to submit rating');
    return await response.json();
  } catch (error) {
    console.error("Error submitting rating:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: String(error) };
    }
  }
};

export const getAverageRating = async (contentId: any, contentType = 'article') => {
  try {
    const response = await fetch(`http://localhost:3001/api/ratings/average/${contentId}?type=${contentType}`);
    if (!response.ok) throw new Error('Failed to get rating');
    return await response.json();
  } catch (error) {
    console.error("Error fetching rating:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: String(error) };
    }
  }
};

// Add this function to your API service
/**
 * Creates a temporary article to get a valid MongoDB ObjectId
 * This is needed because MongoDB requires proper ObjectIds for references
 */
export const createTemporaryArticle = async () => {
  try {
    console.log('Creating temporary article for evidence submission');
    
    const response = await fetch('http://localhost:3001/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "Temporary Article for Evidence",
        authors: "System Generated",
        journal: "N/A",
        year: new Date().getFullYear(),
        // Don't set status here, let the backend handle the default 'pending' status
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to create temporary article');
    }
    
    const result = await response.json();
    console.log('Temporary article created:', result);
    
    // Check the structure of the result and handle different response formats
    if (result.data && result.data._id) {
      return result.data._id; // NestJS typical response format
    } else if (result._id) {
      return result._id; // Direct document response
    } else if (result.id) {
      return result.id; // Some APIs use 'id' instead of '_id'
    } else {
      // If we can't find an ID, log the response and throw an error
      console.error('Unexpected API response format:', result);
      throw new Error('Could not retrieve article ID from response');
    }
  } catch (error) {
    console.error("Error creating temporary article:", error);
    throw error;
  }
};