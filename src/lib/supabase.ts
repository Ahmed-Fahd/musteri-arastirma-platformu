import { createClient } from '@supabase/supabase-js';

// Supabase yapılandırması
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key environment variables tanımlanmalı');
}

// Supabase client oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          country: string;
          company_name: string;
          website: string | null;
          sector: string;
          interest_status: 'yes' | 'no';
          priority: 'high' | 'medium' | 'low';
          action_note: string;
          follow_up_status: 'first-follow' | 'second-follow' | 'none';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          country: string;
          company_name: string;
          website?: string | null;
          sector: string;
          interest_status: 'yes' | 'no';
          priority: 'high' | 'medium' | 'low';
          action_note: string;
          follow_up_status: 'first-follow' | 'second-follow' | 'none';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          country?: string;
          company_name?: string;
          website?: string | null;
          sector?: string;
          interest_status?: 'yes' | 'no';
          priority?: 'high' | 'medium' | 'low';
          action_note?: string;
          follow_up_status?: 'first-follow' | 'second-follow' | 'none';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}