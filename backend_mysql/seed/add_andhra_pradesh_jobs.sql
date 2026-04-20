-- Add Andhra Pradesh jobs
INSERT INTO jobs (title, description, employerId, state, city, village, salary_min, salary_max, jobType, category, requirements, isActive, womenOnly) VALUES
('Senior Developer', 'Looking for experienced full-stack developer', 1, 'Telangana', 'Hyderabad', 'HITEC City', 60000, 120000, 'Full-time', 'Software Development', 'Java, Spring Boot, MySQL', TRUE, FALSE),
('Data Analyst', 'Analyze business data and create reports', 1, 'Telangana', 'Hyderabad', 'Kondapur', 40000, 80000, 'Full-time', 'Software Development', 'SQL, Excel, Tableau', TRUE, FALSE),
('Agricultural Expert', 'Modern farming techniques consultant', 1, 'Telangana', 'Hyderabad', 'HITEC City', 30000, 60000, 'Full-time', 'Agriculture', 'Agricultural Science Degree', TRUE, TRUE),
('Content Writer', 'Create engaging content for digital platform', 1, 'Telangana', 'Hyderabad', 'Kondapur', 25000, 50000, 'Part-time', 'Education', 'Good writing skills', TRUE, TRUE),
('Sales Executive', 'Sell IT services to corporate clients', 1, 'Telangana', 'Hyderabad', 'HITEC City', 35000, 70000, 'Full-time', 'Sales & Marketing', 'Communication skills', TRUE, FALSE)
ON DUPLICATE KEY UPDATE title=title;
