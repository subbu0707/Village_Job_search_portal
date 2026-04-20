-- Comprehensive job listings across India
-- Karnataka Jobs
INSERT INTO jobs (title, description, employerId, state, city, village, salary_min, salary_max, jobType, category, requirements, isActive, womenOnly) VALUES
('Software Engineer', 'Build scalable web applications', 1, 'Karnataka', 'Bangalore', 'Whitefield', 50000, 100000, 'Full-time', 'Software Development', 'Java, Spring, MySQL', TRUE, FALSE),
('UX Designer', 'Design mobile and web interfaces', 1, 'Karnataka', 'Bangalore', 'Electronic City', 45000, 90000, 'Full-time', 'Software Development', 'Figma, Adobe XD', TRUE, TRUE),
('Database Administrator', 'Manage and optimize databases', 1, 'Karnataka', 'Bangalore', 'Marathahalli', 55000, 110000, 'Full-time', 'Software Development', 'MySQL, PostgreSQL', TRUE, FALSE),
('Digital Marketer', 'Execute digital marketing campaigns', 1, 'Karnataka', 'Mysore', 'Chamundi Nagar', 30000, 60000, 'Full-time', 'Sales & Marketing', 'SEO, SEM, Social Media', TRUE, TRUE),
('Quality Assurance', 'Test software applications', 1, 'Karnataka', 'Mangalore', 'Surathkal', 35000, 70000, 'Full-time', 'Software Development', 'Manual Testing, Automation', TRUE, FALSE),

-- Maharashtra Jobs
('Business Development', 'Develop new business strategies', 1, 'Maharashtra', 'Mumbai', 'Bandra', 60000, 120000, 'Full-time', 'Sales & Marketing', 'Business acumen', TRUE, FALSE),
('Finance Manager', 'Manage company finances', 1, 'Maharashtra', 'Mumbai', 'Andheri', 70000, 140000, 'Full-time', 'Administration', 'CA certified', TRUE, FALSE),
('Project Manager', 'Manage IT projects', 1, 'Maharashtra', 'Pune', 'Hinjewadi', 55000, 105000, 'Full-time', 'Administration', 'PMP or Agile', TRUE, FALSE),
('Customer Support', 'Provide customer support services', 1, 'Maharashtra', 'Nagpur', 'Sitabuldi', 20000, 40000, 'Full-time', 'Customer Service', 'Communication skills', TRUE, TRUE),

-- Uttar Pradesh Jobs
('Teacher', 'Teach computer science', 1, 'Uttar Pradesh', 'Lucknow', 'Gomti Nagar', 25000, 50000, 'Full-time', 'Education', 'B.Tech/M.Tech', TRUE, TRUE),
('Network Engineer', 'Manage network infrastructure', 1, 'Uttar Pradesh', 'Noida', 'Sector 62', 40000, 80000, 'Full-time', 'Software Development', 'CCNA certified', TRUE, FALSE),
('Production Manager', 'Oversee manufacturing', 1, 'Uttar Pradesh', 'Kanpur', 'Govind Nagar', 35000, 70000, 'Full-time', 'Manufacturing', 'Production experience', TRUE, FALSE),

-- West Bengal Jobs
('Graphic Designer', 'Design marketing materials', 1, 'West Bengal', 'Kolkata', 'Salt Lake', 30000, 60000, 'Full-time', 'Software Development', 'Photoshop, Illustrator', TRUE, TRUE),
('HR Executive', 'Manage human resources', 1, 'West Bengal', 'Kolkata', 'Howrah', 28000, 55000, 'Full-time', 'Administration', 'HR experience', TRUE, TRUE),
('Manufacturing Technician', 'Operate machinery', 1, 'West Bengal', 'Darjeeling', 'Kurseong', 20000, 40000, 'Full-time', 'Manufacturing', 'Technical knowledge', TRUE, FALSE),

-- Tamil Nadu Jobs
('Backend Developer', 'Develop server-side APIs', 1, 'Tamil Nadu', 'Chennai', 'T Nagar', 50000, 100000, 'Full-time', 'Software Development', 'Node.js, Python', TRUE, FALSE),
('Supply Chain Officer', 'Manage supply chain operations', 1, 'Tamil Nadu', 'Coimbatore', 'Peelamedu', 40000, 80000, 'Full-time', 'Administration', 'Supply chain knowledge', TRUE, FALSE),
('Healthcare Professional', 'Provide medical services', 1, 'Tamil Nadu', 'Madurai', 'Anna Nagar', 45000, 90000, 'Full-time', 'Healthcare', 'Medical degree', TRUE, TRUE),

-- Gujarat Jobs
('Electrical Engineer', 'Design electrical systems', 1, 'Gujarat', 'Ahmedabad', 'Thaltej', 40000, 80000, 'Full-time', 'Manufacturing', 'B.Tech Electrical', TRUE, FALSE),
('Sales Representative', 'Sell products to retailers', 1, 'Gujarat', 'Surat', 'Adajan', 25000, 50000, 'Full-time', 'Sales & Marketing', 'Sales skills', TRUE, FALSE),
('Fashion Designer', 'Design clothing collections', 1, 'Gujarat', 'Rajkot', 'Racecourse Road', 30000, 60000, 'Full-time', 'Software Development', 'Design skills', TRUE, TRUE),

-- Rajasthan Jobs
('Civil Engineer', 'Design construction projects', 1, 'Rajasthan', 'Jaipur', 'C Scheme', 45000, 90000, 'Full-time', 'Construction', 'B.Tech Civil', TRUE, FALSE),
('Tourism Guide', 'Guide tourists to attractions', 1, 'Rajasthan', 'Jodhpur', 'Ratanada', 18000, 35000, 'Full-time', 'Hospitality', 'Regional knowledge', TRUE, TRUE),

-- Punjab Jobs
('Agricultural Scientist', 'Research modern farming', 1, 'Punjab', 'Chandigarh', 'Sector 35', 35000, 70000, 'Full-time', 'Agriculture', 'M.Sc Agriculture', TRUE, FALSE),
('Hotel Manager', 'Manage hotel operations', 1, 'Punjab', 'Amritsar', 'Golden Temple Area', 40000, 80000, 'Full-time', 'Hospitality', 'Hotel management', TRUE, TRUE),
('Logistics Coordinator', 'Coordinate shipping', 1, 'Punjab', 'Ludhiana', 'Sarabha Nagar', 28000, 55000, 'Full-time', 'Transportation', 'Logistics experience', TRUE, FALSE),

-- Haryana Jobs
('Compliance Officer', 'Ensure regulatory compliance', 1, 'Haryana', 'Faridabad', 'Sector 37', 38000, 75000, 'Full-time', 'Administration', 'Legal knowledge', TRUE, TRUE),
('IT Support', 'Provide technical support', 1, 'Haryana', 'Gurgaon', 'Sector 44', 22000, 45000, 'Full-time', 'Customer Service', 'Windows, Linux', TRUE, FALSE),

-- Jharkhand Jobs
('Mining Engineer', 'Oversee mining operations', 1, 'Jharkhand', 'Jamshedpur', 'Bistupur', 45000, 90000, 'Full-time', 'Manufacturing', 'B.Tech Mining', TRUE, FALSE),
('Community Worker', 'Social development work', 1, 'Jharkhand', 'Ranchi', 'Doranda', 18000, 35000, 'Full-time', 'Administration', 'Social work', TRUE, TRUE)
ON DUPLICATE KEY UPDATE title=title;
