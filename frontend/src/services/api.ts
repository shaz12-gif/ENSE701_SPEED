/* eslint-disable @typescript-eslint/no-explicit-any */
// API service for communicating with the backend

// Article API functions
export const getArticles = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:3001/api/articles${queryString ? `?${queryString}` : ''}`;
    console.log('Fetching articles from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Articles data received:', data);
    
    // Handle different response formats
    if (data.success === false) {
      return data; // Already in the expected format with success: false
    }
    
    // If articles are directly in data or in data.data
    const articles = Array.isArray(data) ? data : (data.data || []);
    
    return { 
      success: true, 
      data: articles,
      message: 'Articles fetched successfully'
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fetch articles', 
      data: []
    };
  }
};

// Updated submitArticle function with better error handling
export const submitArticle = async (articleData: any) => {
  try {
    // Check if articleData is FormData (with file) or plain object
    const isFormData = articleData instanceof FormData;
    
    // Add console logs to debug
    console.log('Submitting article to:', 'http://localhost:3001/api/articles');
    console.log('With data type:', isFormData ? 'FormData' : 'JSON');
    
    if (isFormData) {
      // Log the FormData contents for debugging
      console.log("FormData contents:");
      for (const pair of articleData.entries()) {
        console.log(pair[0], pair[1]);
      }
    }
    
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch('http://localhost:3001/api/articles', {
      method: 'POST',
      headers,
      body: isFormData ? articleData : JSON.stringify(articleData),
      credentials: 'include'
    });
    
    // Better error handling
    if (!response.ok) {
      try {
        // Try to get error details from the response
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Server returned error JSON:', errorData);
          
          let errorMessage = 'Unknown server error';
          
          // Extract error message with fallbacks for different structures
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else {
            errorMessage = `Server error: ${response.status} (${JSON.stringify(errorData)})`;
          }
          
          throw new Error(errorMessage);
        } else {
          const errorText = await response.text();
          console.error('Server returned non-JSON error:', errorText);
          throw new Error(`Server error (${response.status}): ${errorText.substring(0, 100)}...`);
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`Server error (${response.status}): Could not parse error details`);
      }
    }
    
    const data = await response.json();
    return { 
      success: true, 
      data: data.data, 
      message: data.message || 'Article submitted successfully' 
    };
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

export const submitEvidence = async (evidenceData: { articleId: string; practiceId: string; claim: string; supportsClaim: boolean; title: string; source: string; year: number; description?: string; }) => {
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
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to create temporary article');
    }
    
    const result = await response.json();
    console.log('Temporary article created:', result);
    
    // Return the ID directly if it's in the expected format
    if (result._id) {
      return result._id;
    } else if (result.data && result.data._id) {
      return result.data._id;
    } else {
      console.error('Unexpected API response format:', result);
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Failed to create temporary article:', error);
    throw error;
  }
};

/**
 * Fetches all practices from the API
 */
export async function getPractices() {
  try {
    const response = await fetch('/api/practices');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Error fetching practices:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fetch practices', 
      data: [] 
    };
  }
}

/**
 * Searches for evidence based on provided filters
 * @param filters Object containing filter criteria
 */
export async function searchEvidence(filters?: Record<string, string>) {
  try {
    let url = '/api/evidence';
    
    // Add query parameters if filters are provided
    if (filters && Object.keys(filters).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      url += `?${queryParams.toString()}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Error searching evidence:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to search evidence', 
      data: [] 
    };
  }
}

/**
 * Fetches all approved articles from the API
 */
export async function getApprovedArticles() {
  try {
    // This is the same as getArticles with a status filter
    const response = await fetch('/api/articles?status=approved');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Error fetching approved articles:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fetch approved articles', 
      data: [] 
    };
  }
}

/**
 * Approves a pending article
 * @param articleId The ID of the article to approve
 * @param moderatorId The ID of the moderator performing the action
 * @param notes Optional notes from the moderator
 */
export async function approveArticle(articleId: string, moderatorId: string, notes: string = '') {
  try {
    const response = await fetch(`/api/articles/${articleId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        moderatorId,
        notes
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Error approving article:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to approve article', 
      data: null 
    };
  }
}

/**
 * Rejects a pending article
 * @param articleId The ID of the article to reject
 * @param moderatorId The ID of the moderator performing the action
 * @param notes Reason for rejection (required)
 */
export async function rejectArticle(articleId: string, moderatorId: string, notes: string) {
  try {
    if (!notes.trim()) {
      return {
        success: false,
        message: 'Rejection reason is required',
        data: null
      };
    }
    
    const response = await fetch(`/api/articles/${articleId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        moderatorId,
        notes
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Error rejecting article:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to reject article', 
      data: null 
    };
  }
}