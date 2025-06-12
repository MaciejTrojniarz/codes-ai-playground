/*
  # Create discount codes table and storage setup

  1. New Tables
    - `discount_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `store_name` (text, required)
      - `expiry_date` (date, required)
      - `code` (text, optional - for text codes)
      - `conditions` (text, optional)
      - `min_amount` (decimal, optional)
      - `image_url` (text, optional - for receipt images)
      - `status` (enum: active, used, expired)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `discount_codes` table
    - Add policies for authenticated users to manage their own codes
    - Create storage bucket for receipts with appropriate policies

  3. Storage
    - Creates 'receipts' storage bucket
    - Sets up RLS policies for file uploads and access
*/

-- Create enum type for discount code status
CREATE TYPE discount_code_status AS ENUM ('active', 'used', 'expired');

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store_name text NOT NULL,
  expiry_date date NOT NULL,
  code text,
  conditions text,
  min_amount decimal(10,2),
  image_url text,
  status discount_code_status DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for discount_codes table
CREATE POLICY "Users can view own discount codes"
  ON discount_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own discount codes"
  ON discount_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discount codes"
  ON discount_codes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own discount codes"
  ON discount_codes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload receipt images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own receipt images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own receipt images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own receipt images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_discount_codes_user_id ON discount_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_status ON discount_codes(status);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expiry_date ON discount_codes(expiry_date);