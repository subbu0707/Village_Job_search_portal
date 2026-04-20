-- Create complaints table for job-related complaints and general complaints

CREATE TABLE IF NOT EXISTS complaints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  jobId INT NULL,
  complaintType ENUM('job_issue', 'user_behavior', 'payment_dispute', 'fraud', 'technical', 'other') DEFAULT 'other',
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending', 'investigating', 'resolved', 'closed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolvedAt TIMESTAMP NULL,
  adminNotes TEXT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE SET NULL,
  INDEX idx_user (userId),
  INDEX idx_job (jobId),
  INDEX idx_status (status),
  INDEX idx_created (createdAt)
);

-- Add job-specific chat/questions table
CREATE TABLE IF NOT EXISTS job_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jobId INT NOT NULL,
  seekerId INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NULL,
  answeredAt TIMESTAMP NULL,
  isPublic BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (seekerId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_job (jobId),
  INDEX idx_seeker (seekerId),
  INDEX idx_public (isPublic)
);

-- Add support contact information table
CREATE TABLE IF NOT EXISTS support_contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contactType ENUM('phone', 'email', 'whatsapp', 'address') NOT NULL,
  contactValue VARCHAR(255) NOT NULL,
  displayName VARCHAR(100) NOT NULL,
  description TEXT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  displayOrder INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (contactType),
  INDEX idx_active (isActive)
);

-- Insert default support contacts
INSERT INTO support_contacts (contactType, contactValue, displayName, description, isActive, displayOrder) VALUES
('phone', '+91-1800-XXX-XXXX', 'Customer Support', 'Available 24/7 for all your queries', TRUE, 1),
('whatsapp', '+91-98765-XXXXX', 'WhatsApp Support', 'Chat with us on WhatsApp', TRUE, 2),
('email', 'support@villagejobshub.com', 'Email Support', 'Write to us for detailed queries', TRUE, 3),
('email', 'complaints@villagejobshub.com', 'Complaints Email', 'Send your complaints and grievances', TRUE, 4);

-- Add isRead flag and jobId to messages table (ignore errors if already exists)
