-- Add location fields if they don't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE users ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE users ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add indexes for location-based queries
ALTER TABLE jobs ADD INDEX IF NOT EXISTS idx_location (latitude, longitude);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_location_user (latitude, longitude);
