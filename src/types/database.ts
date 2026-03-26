// Database types aligned with Supabase schema
export type AppRole = 'buyer' | 'seller' | 'admin' | 'staff';
export type ListingType = 'house' | 'apartment' | 'townhouse' | 'villa' | 'land' | 'plot' | 'commercial' | 'office' | 'shop' | 'warehouse' | 'industrial' | 'other';
export type ReviewStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';
export type PublishStatus = 'unpublished' | 'published' | 'paused' | 'sold' | 'archived';
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'viewing_scheduled' | 'negotiation' | 'won' | 'lost';
export type LeadSource = 'property_form' | 'contact_form' | 'whatsapp' | 'phone' | 'walk_in' | 'agent' | 'other';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type SellerVerificationStatus = 'pending' | 'verified' | 'rejected';

export type Profile = {
  id: string;
  role: AppRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  company_name?: string;
  company_registration?: string;
  seller_verification_status: SellerVerificationStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  slug: string;
  property_type: ListingType;
  review_status: ReviewStatus;
  publish_status: PublishStatus;
  price: number;
  currency: string;
  is_negotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  parking_spaces: number;
  furnished: boolean;
  has_pool: boolean;
  has_garden: boolean;
  has_security: boolean;
  has_electricity: boolean;
  has_water: boolean;
  has_internet: boolean;
  address_line?: string;
  location: string;
  city: string;
  district?: string;
  province?: string;
  postal_code?: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  is_featured: boolean;
  featured_until?: string;
  featured_image_url?: string;
  views_count: number;
  inquiries_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  storage_path?: string;
  alt_text?: string;
  description?: string;
  is_primary: boolean;
  display_order: number;
  uploaded_by?: string;
  file_size?: number;
  dimensions?: string;
  created_at: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  inquiry_type: 'general_inquiry' | 'property_question' | 'listing_inquiry' | 'partnership' | 'support' | 'other';
  subject: string;
  message: string;
  status: 'new' | 'read' | 'in_progress' | 'responded' | 'closed';
  response_message?: string;
  responded_by?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
};

export type CRMLead = {
  id: string;
  property_id?: string;
  buyer_name: string;
  buyer_email?: string;
  buyer_phone?: string;
  inquiry_message?: string;
  source: LeadSource;
  stage: LeadStage;
  preferred_viewing_date?: string;
  preferred_viewing_time?: string;
  assigned_to?: string;
  created_by?: string;
  last_contacted_at?: string;
  next_followup_at?: string;
  lost_reason?: string;
  won_amount?: number;
  created_at: string;
  updated_at: string;
};

export type CRMNote = {
  id: string;
  lead_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export type CRMLeadEvent = {
  id: string;
  lead_id: string;
  actor_id?: string;
  event_type: string;
  payload?: Record<string, any>;
  created_at: string;
};

export type ViewingAppointment = {
  id: string;
  property_id: string;
  lead_id?: string;
  appointment_date: string;
  time_start: string;
  time_end: string;
  seller_id: string;
  scheduled_by: string;
  status: AppointmentStatus;
  feedback?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
};

export type SavedProperty = {
  user_id: string;
  property_id: string;
  is_favorite: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type AdminMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_type: 'info_request' | 'approval_notification' | 'rejection_notification' | 'lead_followup' | 'appointment_scheduled' | 'general_inquiry';
  related_property_id?: string;
  related_lead_id?: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent' | 'read' | 'archived';
  read_at?: string;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  actor_id?: string;
  action_type: string;
  entity_table?: string;
  entity_id?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
};
