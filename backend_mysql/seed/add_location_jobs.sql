-- Seed database with Indian locations and sample jobs
-- 11 States with major cities and villages

-- Insert Indian States and Cities
INSERT INTO locations (state, city, village) VALUES
-- Karnataka
('Karnataka', 'Bangalore', 'Whitefield'),
('Karnataka', 'Bangalore', 'Electronic City'),
('Karnataka', 'Bangalore', 'Marathahalli'),
('Karnataka', 'Mysore', 'Chamundi Nagar'),
('Karnataka', 'Mangalore', 'Surathkal'),

-- Maharashtra
('Maharashtra', 'Mumbai', 'Bandra'),
('Maharashtra', 'Mumbai', 'Andheri'),
('Maharashtra', 'Pune', 'Hinjewadi'),
('Maharashtra', 'Nagpur', 'Sitabuldi'),

-- Uttar Pradesh
('Uttar Pradesh', 'Lucknow', 'Gomti Nagar'),
('Uttar Pradesh', 'Noida', 'Sector 62'),
('Uttar Pradesh', 'Kanpur', 'Govind Nagar'),

-- West Bengal
('West Bengal', 'Kolkata', 'Salt Lake'),
('West Bengal', 'Kolkata', 'Howrah'),
('West Bengal', 'Darjeeling', 'Kurseong'),

-- Tamil Nadu
('Tamil Nadu', 'Chennai', 'T Nagar'),
('Tamil Nadu', 'Coimbatore', 'Peelamedu'),
('Tamil Nadu', 'Madurai', 'Anna Nagar'),

-- Gujarat
('Gujarat', 'Ahmedabad', 'Thaltej'),
('Gujarat', 'Surat', 'Adajan'),
('Gujarat', 'Rajkot', 'Racecourse Road'),

-- Rajasthan
('Rajasthan', 'Jaipur', 'C Scheme'),
('Rajasthan', 'Jodhpur', 'Ratanada'),

-- Punjab
('Punjab', 'Chandigarh', 'Sector 35'),
('Punjab', 'Amritsar', 'Golden Temple Area'),
('Punjab', 'Ludhiana', 'Sarabha Nagar'),

-- Haryana
('Haryana', 'Faridabad', 'Sector 37'),
('Haryana', 'Gurgaon', 'Sector 44'),

-- Telangana
('Telangana', 'Hyderabad', 'HITEC City'),
('Telangana', 'Hyderabad', 'Kondapur'),

-- Jharkhand
('Jharkhand', 'Ranchi', 'Doranda'),
('Jharkhand', 'Jamshedpur', 'Bistupur')
ON DUPLICATE KEY UPDATE state=state;
