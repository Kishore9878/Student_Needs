import { referralsApiClient as api } from '@/services/apiClient.js';


export const externalJobsApi = {
  // Get external jobs
  getExternalJobs: async (page = 1) => {
    const response = await api.get(`/student/jobs/external`, {
      params: { page }
    });
    return response.data;
  },

  // Search external jobs
  searchExternalJobs: async (search, page = 1) => {
    const response = await api.get(`/student/jobs/external/search`, {
      params: { search, page }
    });
    return response.data;
  },
};
