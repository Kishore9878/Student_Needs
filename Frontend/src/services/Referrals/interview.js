import { referralsApiClient as api } from '@/services/apiClient.js';


/**
 * API service for handling AI Interview functionalities
 */
export const interviewApi = {
  /**
   * Get signed URL for ElevenLabs conversation
   * @returns {Promise<{success: boolean, signedUrl: string, message: string}>}
   */
  getSignedUrl: async () => {
    const response = await api.get('/interview/signed-url');
    return response.data;
  },
};
