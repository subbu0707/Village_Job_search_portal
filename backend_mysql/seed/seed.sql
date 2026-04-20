-- Basic seed data - Alternative SQL-only approach
-- This file can be used if prefer direct SQL instead of JavaScript

-- Insert sample users (passwords should be hashed in production)
INSERT INTO users (email, phone, name, role, password, skills, bio) VALUES
('employer@example.com', '9876543210', 'ABC Corporation', 'employer', SHA2('password123', 256), 'Management', 'Leading tech corporation'),
('seeker@example.com', '9876543211', 'John Seeker', 'seeker', SHA2('password123', 256), 'Java,Python,MySQL', 'Experienced developer'),
('admin@example.com', '9876543212', 'Admin User', 'admin', SHA2('password123', 256), 'Administration', 'Platform admin')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample locations (if not already inserted)
INSERT IGNORE INTO locations (state, city, village) VALUES
('Karnataka', 'Bangalore', 'Whitefield'),
('Karnataka', 'Bangalore', 'Electronic City'),
('Karnataka', 'Bangalore', 'Marathahalli'),
('Karnataka', 'Mysore', 'Chamundi Nagar'),
('Maharashtra', 'Mumbai', 'Bandra'),
('Maharashtra', 'Mumbai', 'Andheri'),
('Maharashtra', 'Pune', 'Hinjewadi'),
('Tamil Nadu', 'Chennai', 'T Nagar'),
('Tamil Nadu', 'Coimbatore', 'Peelamedu'),
('Uttar Pradesh', 'Lucknow', 'Gomti Nagar'),
('Uttar Pradesh', 'Noida', 'Sector 62'),
('Gujarat', 'Ahmedabad', 'Thaltej'),
('Gujarat', 'Surat', 'Adajan'),
('West Bengal', 'Kolkata', 'Salt Lake'),
('Rajasthan', 'Jaipur', 'C Scheme'),
('Punjab', 'Chandigarh', 'Sector 35'),
('Haryana', 'Gurgaon', 'Sector 44'),
('Telangana', 'Hyderabad', 'HITEC City'),
('Jharkhand', 'Jamshedpur', 'Bistupur');
