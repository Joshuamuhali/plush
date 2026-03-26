// Export all Supabase services for easy importing
export { PropertyService } from './propertyService';
export { LeadService } from './leadService';
export { AppointmentService } from './appointmentService';
export { ProfileService } from './profileService';

// Export types
export type { PropertyFormData } from './propertyService';
export type { LeadFormData, LeadUpdateData } from './leadService';
export type { AppointmentFormData, AppointmentUpdateData } from './appointmentService';
export type { Profile, ProfileUpdateData } from './profileService';
