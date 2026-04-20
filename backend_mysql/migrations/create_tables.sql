-- Create main tables for Village Jobs Hub

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  name VARCHAR(255) NOT NULL,
  role ENUM('seeker', 'employer', 'admin') DEFAULT 'seeker',
  password VARCHAR(255) NOT NULL,
  skills TEXT,
  bio TEXT,
  location VARCHAR(255),
  profilePicture VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  employerId INT NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  village VARCHAR(100),
  salary_min INT,
  salary_max INT,
  jobType VARCHAR(50),
  category VARCHAR(100),
  requirements TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  womenOnly BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employerId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_state (state),
  INDEX idx_city (city),
  INDEX idx_employer (employerId),
  INDEX idx_active (isActive)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jobId INT NOT NULL,
  seekerId INT NOT NULL,
  status ENUM('pending', 'shortlisted', 'accepted', 'rejected') DEFAULT 'pending',
  appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (seekerId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (jobId, seekerId),
  INDEX idx_status (status),
  INDEX idx_seeker (seekerId)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  senderId INT NOT NULL,
  receiverId INT NOT NULL,
  message TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_receiver (receiverId),
  INDEX idx_sender (senderId)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  message TEXT,
  type VARCHAR(50),
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (userId),
  INDEX idx_read (isRead)
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  village VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  jobCount INT DEFAULT 0,
  UNIQUE KEY unique_location (state, city, village),
  INDEX idx_state (state)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Software Development', 'IT and software development jobs'),
('Agriculture', 'Farming and agricultural jobs'),
('Healthcare', 'Medical and healthcare positions'),
('Education', 'Teaching and education roles'),
('Manufacturing', 'Industrial and manufacturing jobs'),
('Sales & Marketing', 'Sales and marketing positions'),
('Administration', 'Administrative and office roles'),
('Construction', 'Building and construction jobs'),
('Transportation', 'Logistics and transportation'),
('Hospitality', 'Hotel and hospitality services'),
('Retail', 'Retail and shop management'),
('Customer Service', 'Customer support roles')
ON DUPLICATE KEY UPDATE name=name;
