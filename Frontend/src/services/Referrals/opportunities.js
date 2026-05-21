import { referralsApiClient as api } from '@/services/apiClient.js';

/**
 * @namespace opportunitiesApi
 */
export const opportunitiesApi = {
  /**
   * Create a new opportunity (Alumni only)
   * @param {Object} payload - The job details (title, description, skills, etc.)
   * @returns {Promise<Object>}
   */
  createOpportunity: async (payload) => {
    const response = await api.post('/opportunities/create', payload);
    return response.data;
  },

  /**
   * Update an opportunity (Alumni only - owner)
   * @param {string} opportunityId 
   * @param {Object} payload 
   * @returns {Promise<Object>}
   */
  updateOpportunity: async (opportunityId, payload) => {
    const response = await api.put(`/opportunities/${opportunityId}`, payload);
    return response.data;
  },

  /**
   * Delete/Close an opportunity (Alumni only - owner)
   * @param {string} opportunityId 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  deleteOpportunity: async (opportunityId) => {
    const response = await api.delete(`/opportunities/${opportunityId}`);
    return response.data;
  },

  /**
   * Get all opportunities from same college
   * @returns {Promise<Object>}
   */
  getOpportunities: async () => {
    const response = await api.get('/opportunities');
    return response.data;
  },

  /**
   * Get my posted opportunities (Alumni only)
   * @returns {Promise<Object>}
   */
  getMyOpportunities: async () => {
    const response = await api.get('/my-opportunities');
    return response.data;
  },

  /**
   * Apply for referral with interview scores
   * @param {string} opportunityId 
   * @returns {Promise<Object>}
   */
  applyForReferral: async (opportunityId) => {
    const scoresData = localStorage.getItem('interviewScores');
    const scores = scoresData ? JSON.parse(scoresData) : {};

    const response = await api.post('/apply', {
      opportunityId,
      profileScore: scores.profileScore || null,
      interviewScore: scores.interviewScore || null,
    });

    localStorage.removeItem('interviewScores');
    return response.data;
  },

  /**
   * Get my applications
   * @returns {Promise<Object>}
   */
  getMyApplications: async () => {
    const response = await api.get('/my-applications');
    return response.data;
  },

  /**
   * Get application details
   * @param {string} applicationId 
   * @returns {Promise<Object>}
   */
  getApplicationDetails: async (applicationId) => {
    const response = await api.get(`/my-applications/${applicationId}`);
    return response.data;
  },
};
