-- Add terms acceptance columns to users table

ALTER TABLE users 
ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN terms_accepted_at TIMESTAMP NULL,
ADD INDEX idx_terms_accepted (terms_accepted);
