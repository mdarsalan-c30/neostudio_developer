// Temporary types for new database tables until Supabase types are regenerated

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}