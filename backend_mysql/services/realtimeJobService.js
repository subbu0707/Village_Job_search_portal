// Real-time Job Service for generating and managing real-time job data
const db = require('../config/database');

class RealTimeJobService {
  constructor() {
    this.jobCategories = [
      'Software Development',
      'Agriculture',
      'Healthcare',
      'Education',
      'Manufacturing',
      'Sales & Marketing',
      'Administration',
      'Construction',
      'Transportation',
      'Hospitality',
      'Retail',
      'Customer Service'
    ];

    this.jobTypes = ['Full-time', 'Part-time', 'Contract'];

    this.locations = [
      { state: 'Karnataka', city: 'Bangalore', village: 'Whitefield' },
      { state: 'Karnataka', city: 'Bangalore', village: 'Electronic City' },
      { state: 'Maharashtra', city: 'Mumbai', village: 'Bandra' },
      { state: 'Maharashtra', city: 'Pune', village: 'Hinjewadi' },
      { state: 'Tamil Nadu', city: 'Chennai', village: 'T Nagar' },
      { state: 'Uttar Pradesh', city: 'Noida', village: 'Sector 62' },
      { state: 'Gujarat', city: 'Ahmedabad', village: 'Thaltej' },
      { state: 'West Bengal', city: 'Kolkata', village: 'Salt Lake' },
      { state: 'Rajasthan', city: 'Jaipur', village: 'C Scheme' },
      { state: 'Punjab', city: 'Chandigarh', village: 'Sector 35' },
      { state: 'Haryana', city: 'Gurgaon', village: 'Sector 44' },
      { state: 'Telangana', city: 'Hyderabad', village: 'HITEC City' }
    ];
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateSalaryRange() {
    const min = Math.floor(Math.random() * 50000) + 20000;
    const max = min + Math.floor(Math.random() * 100000) + 20000;
    return { min, max };
  }

  generateJobTitle(category) {
    const titles = {
      'Software Development': ['Developer', 'Engineer', 'Architect', 'Lead Developer', 'Technical Lead'],
      'Agriculture': ['Farmer', 'Agricultural Scientist', 'Agronomist', 'Farm Manager'],
      'Healthcare': ['Doctor', 'Nurse', 'Technician', 'Health Worker'],
      'Education': ['Teacher', 'Educator', 'Trainer', 'Instructor'],
      'Manufacturing': ['Technician', 'Operator', 'Manager', 'Supervisor'],
      'Sales & Marketing': ['Executive', 'Manager', 'Coordinator', 'Specialist'],
      'Administration': ['Officer', 'Manager', 'Coordinator', 'Executive'],
      'Construction': ['Engineer', 'Supervisor', 'Foreman', 'Worker'],
      'Transportation': ['Driver', 'Coordinator', 'Manager', 'Executive'],
      'Hospitality': ['Manager', 'Staff', 'Chef', 'Coordinator'],
      'Retail': ['Manager', 'Executive', 'Coordinator', 'Staff'],
      'Customer Service': ['Representative', 'Specialist', 'Coordinator', 'Manager']
    };

    const categoryTitles = titles[category] || ['Professional'];
    return this.getRandomElement(categoryTitles);
  }

  generateJob(employerId) {
    const category = this.getRandomElement(this.jobCategories);
    const location = this.getRandomElement(this.locations);
    const salary = this.generateSalaryRange();

    return {
      title: this.generateJobTitle(category),
      description: `Exciting ${category.toLowerCase()} opportunity in ${location.city}. Great career growth potential.`,
      employerId: employerId,
      state: location.state,
      city: location.city,
      village: location.village,
      salary_min: salary.min,
      salary_max: salary.max,
      jobType: this.getRandomElement(this.jobTypes),
      category: category,
      requirements: 'Bachelor\'s degree or equivalent experience',
      isActive: true,
      womenOnly: Math.random() > 0.8 // 20% chance of women-only job
    };
  }

  async generateAndInsertJobs(count = 50, employerId = 1) {
    try {
      console.log(`📊 Generating ${count} real-time jobs...`);

      for (let i = 0; i < count; i++) {
        const job = this.generateJob(employerId);

        await db.query(
          `INSERT INTO jobs 
           (title, description, employerId, state, city, village, salary_min, salary_max, jobType, category, requirements, isActive, womenOnly) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            job.title,
            job.description,
            job.employerId,
            job.state,
            job.city,
            job.village,
            job.salary_min,
            job.salary_max,
            job.jobType,
            job.category,
            job.requirements,
            job.isActive,
            job.womenOnly
          ]
        );
      }

      console.log(`✅ ${count} jobs generated and inserted successfully`);
      return { success: true, count };
    } catch (error) {
      console.error('❌ Error generating jobs:', error);
      return { success: false, message: error.message };
    }
  }

  async getJobStatistics() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as totalJobs,
          COUNT(DISTINCT state) as totalStates,
          COUNT(DISTINCT city) as totalCities,
          COUNT(DISTINCT category) as totalCategories,
          AVG(salary_min) as avgMinSalary,
          AVG(salary_max) as avgMaxSalary,
          SUM(CASE WHEN womenOnly = TRUE THEN 1 ELSE 0 END) as womenOnlyJobs
        FROM jobs
        WHERE isActive = TRUE
      `);

      return stats[0];
    } catch (error) {
      console.error('❌ Error getting statistics:', error);
      return null;
    }
  }

  async getJobsByCategory() {
    try {
      const [jobs] = await db.query(`
        SELECT category, COUNT(*) as count
        FROM jobs
        WHERE isActive = TRUE
        GROUP BY category
        ORDER BY count DESC
      `);

      return jobs;
    } catch (error) {
      console.error('❌ Error getting jobs by category:', error);
      return [];
    }
  }

  async getTopLocations() {
    try {
      const [locations] = await db.query(`
        SELECT state, city, COUNT(*) as jobCount
        FROM jobs
        WHERE isActive = TRUE
        GROUP BY state, city
        ORDER BY jobCount DESC
        LIMIT 10
      `);

      return locations;
    } catch (error) {
      console.error('❌ Error getting top locations:', error);
      return [];
    }
  }
}

module.exports = new RealTimeJobService();
