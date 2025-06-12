import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://byfreghtdwktaiyclfel.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZnJlZ2h0ZHdrdGFpeWNsZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjYxOTIsImV4cCI6MjA2NTMwMjE5Mn0.uF8FQzRZhu4IVpUKoJ_rao1RhjI7t0XwcXPR23PpWJM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      discount_codes: {
        Row: {
          id: string
          user_id: string
          store_name: string
          expiry_date: string
          code: string | null
          conditions: string | null
          min_amount: number | null
          image_url: string | null
          status: 'active' | 'used' | 'expired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          store_name: string
          expiry_date: string
          code?: string | null
          conditions?: string | null
          min_amount?: number | null
          image_url?: string | null
          status?: 'active' | 'used' | 'expired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          store_name?: string
          expiry_date?: string
          code?: string | null
          conditions?: string | null
          min_amount?: number | null
          image_url?: string | null
          status?: 'active' | 'used' | 'expired'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}