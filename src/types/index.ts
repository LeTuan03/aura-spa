export type UserRole = 'super_admin' | 'branch_manager' | 'staff' | 'client' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branch_id?: string;
  avatar?: string;
  created_at: string;
  notes?: string; // Internal admin note (e.g., VIP, allergies)
  is_blacklisted?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  opening_hours: string; // e.g. "08:00 - 20:00"
  image?: string;
  map_url?: string;
  is_active: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number; // in VND
  duration_minutes: number;
  category: string;
  branch_ids: string[];
  is_active: boolean;
  image?: string;
}

export interface StaffService {
  staff_id: string;
  service_id: string;
}

export interface StaffSchedule {
  id: string;
  staff_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time: string; // "08:00"
  end_time: string;   // "17:00"
  is_working: boolean;
}

export interface StaffTimeOff {
  id: string;
  staff_id: string;
  date: string; // "YYYY-MM-DD"
  reason: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface BookingServiceItem {
  service_id: string;
  service_name: string;
  price: number;
  duration_minutes: number;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  staff_id: string;
  staff_name?: string;
  branch_id: string;
  branch_name?: string;
  services: BookingServiceItem[];
  date: string; // "YYYY-MM-DD"
  start_time: string; // "10:00"
  end_time: string; // "11:30"
  total_amount: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  payment_status: 'unpaid' | 'deposited' | 'paid';
  cancel_reason?: string;
  cancelled_at?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  rating: number; // 1 - 5
  comment: string;
  service_name: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  method: 'cash' | 'transfer' | 'card' | 'momo' | 'vnpay';
  status: 'completed' | 'pending';
  transaction_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  target_role?: UserRole;
  branch_id?: string;
  title: string;
  type: 'booking_created' | 'status_changed' | 'reminder' | 'cancelled';
  message: string;
  is_read: boolean;
  created_at: string;
  booking_id?: string;
}

export interface SystemSettings {
  cancel_deadline_hours: number;
  slot_interval_minutes: number;
  buffer_time_minutes: number;
  deposit_percentage: number;
  business_name: string;
  contact_email: string;
  contact_phone: string;
  allow_guest_booking: boolean;
}
