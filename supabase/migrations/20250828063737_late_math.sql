/*
  # Add phone field to contact_submissions table

  1. Changes
    - Add `phone` column to `contact_submissions` table
    - Column is optional (nullable)
    - Add index for better query performance

  2. Security
    - No changes to RLS policies needed
    - Phone field follows same security model as other optional fields
*/

-- Add phone column to contact_submissions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'phone'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN phone TEXT;
  END IF;
END $$;

-- Add index for phone field for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_phone 
ON contact_submissions(phone) 
WHERE phone IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN contact_submissions.phone IS 'Optional phone number for contact submissions';