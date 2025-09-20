import { useQuery } from "@tanstack/react-query";
import { Property } from "@/types/property";
import { sampleProperties } from "@/data/properties";

export const useProperties = () => {
  return useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return sampleProperties;
    }
  });
};
