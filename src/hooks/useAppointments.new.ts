import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentService, type AppointmentFormData, type AppointmentUpdateData } from '@/services/supabase';

export const useAppointments = (filters?: {
  status?: string;
  seller_id?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => AppointmentService.getAllAppointments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSellerAppointments = (sellerId: string, filters?: {
  status?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['seller-appointments', sellerId, filters],
    queryFn: () => AppointmentService.getSellerAppointments(sellerId, filters),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => AppointmentService.getAppointmentById(appointmentId),
    enabled: !!appointmentId,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ scheduledBy, appointmentData }: { 
      scheduledBy: string; 
      appointmentData: AppointmentFormData;
    }) => AppointmentService.createAppointment(scheduledBy, appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['seller-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appointmentId, updateData }: { 
      appointmentId: string; 
      updateData: AppointmentUpdateData;
    }) => AppointmentService.updateAppointment(appointmentId, updateData),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['seller-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: string }) =>
      AppointmentService.updateAppointmentStatus(appointmentId, status),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['seller-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason?: string }) =>
      AppointmentService.cancelAppointment(appointmentId, reason),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['seller-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appointmentId, feedback, rating }: { 
      appointmentId: string; 
      feedback?: string; 
      rating?: number;
    }) => AppointmentService.completeAppointment(appointmentId, feedback, rating),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['seller-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

export const useUpcomingAppointments = (sellerId?: string) => {
  return useQuery({
    queryKey: ['upcoming-appointments', sellerId],
    queryFn: () => AppointmentService.getUpcomingAppointments(sellerId),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAppointmentStats = (filters?: {
  seller_id?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['appointment-stats', filters],
    queryFn: () => AppointmentService.getAppointmentStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCheckTimeConflict = () => {
  return useMutation({
    mutationFn: ({ 
      sellerId, 
      appointmentDate, 
      timeStart, 
      timeEnd, 
      excludeAppointmentId 
    }: {
      sellerId: string;
      appointmentDate: string;
      timeStart: string;
      timeEnd: string;
      excludeAppointmentId?: string;
    }) => AppointmentService.checkTimeConflict(sellerId, appointmentDate, timeStart, timeEnd, excludeAppointmentId),
  });
};
