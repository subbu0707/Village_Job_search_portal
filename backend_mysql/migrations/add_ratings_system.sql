-- Add rating columns to users table
ALTER TABLE users 
ADD COLUMN averageRating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN totalRatings INT DEFAULT 0;

-- Create ratings table for detailed ratings
CREATE TABLE IF NOT EXISTS ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jobId INT NOT NULL,
  seekerId INT NOT NULL,
  employerId INT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  review TEXT,
  punctuality INT CHECK (punctuality >= 1 AND punctuality <= 5),
  workQuality INT CHECK (workQuality >= 1 AND workQuality <= 5),
  communication INT CHECK (communication >= 1 AND communication <= 5),
  professionalism INT CHECK (professionalism >= 1 AND professionalism <= 5),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (seekerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (employerId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rating (jobId, seekerId, employerId),
  INDEX idx_seeker (seekerId),
  INDEX idx_employer (employerId),
  INDEX idx_rating (rating)
);

-- Add completedAt column to applications table for tracking job completion
ALTER TABLE applications 
ADD COLUMN completedAt TIMESTAMP NULL,
ADD COLUMN isRated BOOLEAN DEFAULT FALSE;
