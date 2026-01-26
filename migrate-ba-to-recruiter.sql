-- =========================================================
-- STEP 1: Add new enum value (RUN THIS FIRST, SEPARATELY)
-- =========================================================
-- Enum values must be committed before they can be used
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'recruiter';

-- =========================================================
-- STEP 2: Perform all other changes (RUN THIS SECOND)
-- =========================================================
-- After Step 1 completes, run this entire block

BEGIN;

-- Update all existing 'ba_recruiter' role values to 'recruiter'
UPDATE users SET role = 'recruiter' WHERE role = 'ba_recruiter';

-- Rename the ba_recruiters table to recruiters
ALTER TABLE ba_recruiters RENAME TO recruiters;

-- Rename constraints on recruiters table
ALTER TABLE recruiters RENAME CONSTRAINT ba_recruiters_user_id_unique TO recruiters_user_id_unique;
ALTER TABLE recruiters RENAME CONSTRAINT ba_recruiters_recruiter_id_unique TO recruiters_recruiter_id_unique;
ALTER TABLE recruiters RENAME CONSTRAINT ba_recruiters_pkey TO recruiters_pkey;
ALTER TABLE recruiters RENAME CONSTRAINT ba_recruiters_user_id_users_id_fk TO recruiters_user_id_users_id_fk;

-- Drop old foreign keys from candidates table
ALTER TABLE candidates DROP CONSTRAINT IF EXISTS candidates_ba_recruiter_id_ba_recruiters_id_fk;

-- Rename column in candidates table
ALTER TABLE candidates RENAME COLUMN ba_recruiter_id TO recruiter_id;

-- Add new foreign key to candidates table
ALTER TABLE candidates ADD CONSTRAINT candidates_recruiter_id_recruiters_id_fk 
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id);

-- Drop old foreign keys from qr_codes table
ALTER TABLE qr_codes DROP CONSTRAINT IF EXISTS qr_codes_ba_recruiter_id_ba_recruiters_id_fk;

-- Rename column in qr_codes table
ALTER TABLE qr_codes RENAME COLUMN ba_recruiter_id TO recruiter_id;

-- Add new foreign key to qr_codes table
ALTER TABLE qr_codes ADD CONSTRAINT qr_codes_recruiter_id_recruiters_id_fk 
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE;

COMMIT;

-- =========================================================
-- VERIFICATION (Run after both steps complete)
-- =========================================================
-- Uncomment these to verify the migration:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%recruiter%';
-- SELECT unnest(enum_range(NULL::user_role));
-- SELECT role, count(*) FROM users GROUP BY role;
