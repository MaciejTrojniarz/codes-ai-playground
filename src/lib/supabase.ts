import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

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