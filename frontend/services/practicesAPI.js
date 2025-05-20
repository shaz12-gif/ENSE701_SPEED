/**
 * API service for practices-related operations
 */

/**
 * Get all software engineering practices
 * @returns {Promise<Array>} Array of practices
 */
export const getAllPractices = async () => {
  try {
    const response = await fetch('/api/practices');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching practices:', error);
    throw error;
  }
};

/**
 * Get a specific software engineering practice by ID
 * @param {string|number} id - Practice ID
 * @returns {Promise<Object>} Practice object
 */
export const getPracticeById = async (id) => {
  try {
    const response = await fetch(`/api/practices/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching practice ${id}:`, error);
    throw error;
  }
};

/**
 * Get evidence for a specific practice
 * @param {string|number} practiceId - Practice ID
 * @returns {Promise<Array>} Array of evidence items
 */
export const getEvidenceForPractice = async (practiceId) => {
  try {
    const response = await fetch(`/api/practices/${practiceId}/evidence`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching evidence for practice ${practiceId}:`, error);
    throw error;
  }
};

/**
 * Submit evidence for a practice
 * @param {string|number} practiceId - Practice ID
 * @param {Object} evidenceData - Evidence data to submit
 * @returns {Promise<Object>} Submitted evidence
 */
export const submitEvidence = async (practiceId, evidenceData) => {
  try {
    const response = await fetch(`/api/practices/${practiceId}/evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evidenceData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error submitting evidence for practice ${practiceId}:`, error);
    throw error;
  }
};