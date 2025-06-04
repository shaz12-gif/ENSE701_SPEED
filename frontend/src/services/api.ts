/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// API service for communicating with the backend

import { ArticleFormData } from "@/components/forms/ArticleForm";
import { callApi, callApiWithFormData } from "@/utils/apiUtils";

// Article API functions
export const getArticles = async (params = {}) => {
  // Convert params to query string
  const queryString = new URLSearchParams(Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => [key, String(value)])
  ).toString();
  
  return callApi(`/api/articles${queryString ? `?${queryString}` : ''}`);
};

export async function submitArticle(data: ArticleFormData | FormData): Promise<any> {
  if (data instanceof FormData) {
    return callApiWithFormData('/api/articles', data);
  } else {
    return callApi('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export async function getApprovedArticles() {
  return callApi('/api/articles?status=approved');
}

export async function getPendingArticles() {
  return callApi('/api/articles?status=pending');
}

export async function approveArticle(articleId: string, moderatorId: string, notes = '') {
  return callApi(`/api/moderation/${articleId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ moderatorId, notes })
  });
}

export async function rejectArticle(articleId: string, moderatorId: string, notes: string) {
  return callApi(`/api/moderation/${articleId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ moderatorId, notes })
  });
}

export async function getPractices() {
  return callApi('/api/practices');
}

export async function getEvidence(filters?: Record<string, string>) {
  let endpoint = '/api/evidence';
  
  if (filters && Object.keys(filters).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    endpoint += `?${queryParams.toString()}`;
  }
  
  return callApi(endpoint);
}

export async function submitEvidence(evidenceData: any) {
  return callApi('/api/evidence', {
    method: 'POST',
    body: JSON.stringify(evidenceData)
  });
}

export async function searchEvidence(filters?: Record<string, string>) {
  return getEvidence(filters);
}

/**
 * Get the average rating for content
 */
export async function getAverageRating(contentId: string, contentType = 'article') {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/api/ratings/average/${contentId}?type=${contentType}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { 
      success: true, 
      data: data 
    };
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fetch average rating',
      data: { averageRating: 0, count: 0 }
    };
  }
}

/**
 * Submit a rating
 */
export async function submitRating(contentId: string, contentType: string, value: number) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/api/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentId,
        contentType,
        value
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { 
      success: true, 
      data 
    };
  } catch (error) {
    console.error('Error submitting rating:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to submit rating' 
    };
  }
}