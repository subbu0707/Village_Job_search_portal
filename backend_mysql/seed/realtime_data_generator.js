// Real-time data generator script
// Run this to generate sample data with job statistics
const db = require('../config/database');
const RealTimeJobService = require('../services/realtimeJobService');

const generateRealTimeData = async () => {
  try {
    console.log('🚀 Starting real-time data generation...\n');

    // 1. Generate 50 sample jobs
    await RealTimeJobService.generateAndInsertJobs(50, 1);

    // 2. Get and display statistics
    console.log('\n📊 Job Statistics:');
    const stats = await RealTimeJobService.getJobStatistics();
    console.log(`   Total Jobs: ${stats.totalJobs}`);
    console.log(`   Total States: ${stats.totalStates}`);
    console.log(`   Total Cities: ${stats.totalCities}`);
    console.log(`   Total Categories: ${stats.totalCategories}`);
    console.log(`   Average Min Salary: ₹${Math.round(stats.avgMinSalary)}`);
    console.log(`   Average Max Salary: ₹${Math.round(stats.avgMaxSalary)}`);
    console.log(`   Women Only Jobs: ${stats.womenOnlyJobs}`);

    // 3. Display jobs by category
    console.log('\n📈 Jobs by Category:');
    const categories = await RealTimeJobService.getJobsByCategory();
    categories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat.count} jobs`);
    });

    // 4. Display top locations
    console.log('\n🌍 Top Locations:');
    const topLocations = await RealTimeJobService.getTopLocations();
    topLocations.forEach(loc => {
      console.log(`   ${loc.state} - ${loc.city}: ${loc.jobCount} jobs`);
    });

    console.log('\n✅ Real-time data generation completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  generateRealTimeData();
}

module.exports = generateRealTimeData;
