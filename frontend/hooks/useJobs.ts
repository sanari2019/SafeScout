import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Job } from '@/types/job';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await api.get<Job[]>('/jobs');
      return response.data;
    }
  });
};

interface CreateJobPayload {
  tier: 'LITE' | 'STANDARD' | 'PLUS';
  listingUrl: string;
  marketplace: 'FACEBOOK' | 'EBAY' | 'GUMTREE' | 'OTHER';
  itemTitle: string;
  itemPrice: number;
  itemPhotos: string[];
  description?: string;
  sellerAge: number;
  photoCount: number;
}

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const response = await api.post('/jobs', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};
