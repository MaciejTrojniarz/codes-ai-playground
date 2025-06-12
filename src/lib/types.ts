export interface DiscountCode {
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

export interface User {
  id: string
  email: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}