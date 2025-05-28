// src/services/SEPracticesService.js
import axios from 'axios';

// Define API base URL - use relative path for API calls
const API_URL = '/api';

// Create API service for SE Practices
const SEPracticeService = {
  // Get all practices
  getAllPractices: async () => {
    try {
      const response = await axios.get(`${API_URL}/practices`);
      return response.data;
    } catch (error) {
      console.error('Error fetching practices:', error);
      throw error;
    }
  },

  // Get practice by ID
  getPracticeById: async (id: unknown) => {
    try {
      const response = await axios.get(`${API_URL}/practices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching practice with ID ${id}:`, error);
      throw error;
    }
  },

  // Submit evidence for a practice
  submitEvidence: async (practiceId: unknown, evidenceData: unknown) => {
    try {
      const response = await axios.post(`${API_URL}/practices/${practiceId}/evidence`, evidenceData);
      return response.data;
    } catch (error) {
      console.error('Error submitting evidence:', error);
      throw error;
    }
  }
};

export default SEPracticeService;