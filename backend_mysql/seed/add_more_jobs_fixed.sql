-- More comprehensive job listings
INSERT INTO jobs (title, description, employerId, state, city, village, salary_min, salary_max, jobType, category, requirements, isActive, womenOnly) VALUES
('Machine Learning Engineer', 'Build ML models and algorithms', 1, 'Karnataka', 'Bangalore', 'Whitefield', 80000, 150000, 'Full-time', 'Software Development', 'Python, TensorFlow', TRUE, FALSE),
('DevOps Engineer', 'Manage deployment and infrastructure', 1, 'Karnataka', 'Bangalore', 'Electronic City', 60000, 120000, 'Full-time', 'Software Development', 'Docker, Kubernetes', TRUE, FALSE),
('Mobile App Developer', 'Develop iOS and Android apps', 1, 'Maharashtra', 'Pune', 'Hinjewadi', 50000, 100000, 'Full-time', 'Software Development', 'React Native, Swift', TRUE, FALSE),
('Product Manager', 'Manage product development', 1, 'Maharashtra', 'Mumbai', 'Bandra', 70000, 140000, 'Full-time', 'Administration', 'Product experience', TRUE, FALSE),
('Quality Analyst', 'Test and ensure quality', 1, 'Tamil Nadu', 'Chennai', 'T Nagar', 35000, 70000, 'Full-time', 'Software Development', 'Manual testing', TRUE, TRUE),
('System Administrator', 'Manage IT systems', 1, 'Uttar Pradesh', 'Noida', 'Sector 62', 38000, 75000, 'Full-time', 'Software Development', 'Windows Server', TRUE, FALSE),
('Accountant', 'Manage financial records', 1, 'West Bengal', 'Kolkata', 'Salt Lake', 28000, 55000, 'Full-time', 'Administration', 'Accounting knowledge', TRUE, TRUE),
('Consultant', 'Business consulting services', 1, 'Maharashtra', 'Mumbai', 'Andheri', 75000, 150000, 'Full-time', 'Administration', 'MBA preferred', TRUE, FALSE),
('Trainer', 'Provide training programs', 1, 'Gujarat', 'Ahmedabad', 'Thaltej', 30000, 60000, 'Full-time', 'Education', 'Training experience', TRUE, TRUE),
('Architect', 'Design building architecture', 1, 'Rajasthan', 'Jaipur', 'C Scheme', 55000, 110000, 'Full-time', 'Construction', 'B.Arch degree', TRUE, FALSE),
('Electrician', 'Electrical installation and repair', 1, 'Punjab', 'Chandigarh', 'Sector 35', 20000, 40000, 'Full-time', 'Manufacturing', 'Electrical knowledge', TRUE, FALSE),
('Plumber', 'Plumbing repair services', 1, 'Haryana', 'Gurgaon', 'Sector 44', 18000, 35000, 'Full-time', 'Manufacturing', 'Plumbing skills', TRUE, FALSE),
('Chef', 'Cook and manage kitchen', 1, 'Karnataka', 'Bangalore', 'Marathahalli', 35000, 70000, 'Full-time', 'Hospitality', 'Culinary skills', TRUE, FALSE),
('Reception', 'Handle reception duties', 1, 'Maharashtra', 'Mumbai', 'Bandra', 20000, 40000, 'Full-time', 'Customer Service', 'Communication', TRUE, TRUE),
('Security Guard', 'Provide security services', 1, 'Uttar Pradesh', 'Lucknow', 'Gomti Nagar', 15000, 30000, 'Full-time', 'Administration', 'Security training', TRUE, FALSE)
ON DUPLICATE KEY UPDATE title=title;
