// backend_mysql/models/jobModel.js
const Job = require("./mongo/Job");
const User = require("./mongo/User");
const SavedJob = require("./mongo/SavedJob");
const { getNextId } = require("../utils/nextId");

const ACTIVE_JOB_FILTER = {
  $or: [
    { is_active: 1 },
    { is_active: true },
    { isActive: 1 },
    { isActive: true },
  ],
};

const withEmployer = async (jobDoc) => {
  if (!jobDoc) return null;

  const job = jobDoc.toObject ? jobDoc.toObject() : jobDoc;
  const employer = await User.findOne(
    { id: Number(job.employer_id) },
    { _id: 0, name: 1, email: 1 },
  ).lean();

  return {
    ...job,
    employerName: employer?.name || null,
    employerEmail: employer?.email || null,
  };
};

const withEmployersBulk = async (jobs) => {
  const employerIds = [...new Set(jobs.map((job) => Number(job.employer_id)))];
  const employers = await User.find(
    { id: { $in: employerIds } },
    { _id: 0, id: 1, name: 1, email: 1 },
  ).lean();

  const employerMap = new Map(employers.map((u) => [u.id, u]));
  return jobs.map((job) => ({
    ...job,
    employerName: employerMap.get(Number(job.employer_id))?.name || null,
    employerEmail: employerMap.get(Number(job.employer_id))?.email || null,
  }));
};

// Create a new job
exports.createJob = async (jobData) => {
  const {
    employer_id,
    title,
    description,
    jobType,
    salary_min,
    salary_max,
    location_state,
    location_city,
    village,
    category,
    required_skills,
    women_only,
    posted_date,
    deadline,
  } = jobData;
  const id = await getNextId("jobs");

  await Job.create({
    id,
    employer_id: Number(employer_id),
    title,
    description,
    jobType: jobType || "Full-time",
    salary_min: salary_min || null,
    salary_max: salary_max || null,
    state: location_state,
    city: location_city,
    village: village || null,
    category: category || "General",
    requirements: required_skills || null,
    womenOnly: women_only || 0,
    is_active: 1,
    isActive: 1,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return id;
};

// Get job by ID
exports.getJobById = async (jobId) => {
  const numericJobId = Number(jobId);
  if (!Number.isFinite(numericJobId)) {
    return null;
  }

  const row = await Job.findOne({ id: numericJobId }).lean();
  if (!row) return null;
  return withEmployer(row);
};

// Get all active jobs
exports.getAllJobs = async (limit = 5000, offset = 0) => {
  console.log(
    `📊 Fetching jobs from database (limit: ${limit}, offset: ${offset})`,
  );
  const rows = await Job.find(ACTIVE_JOB_FILTER)
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();

  const result = await withEmployersBulk(rows);
  console.log(`✅ Retrieved ${result.length} jobs from database`);
  return result;
};

// Get jobs by employer
exports.getJobsByEmployer = async (employerId) => {
  console.log("📥 getJobsByEmployer called with employerId:", employerId);
  const rows = await Job.find({ employer_id: Number(employerId) })
    .sort({ created_at: -1 })
    .lean();
  console.log("✅ Found", rows.length, "jobs for employer", employerId);
  console.log(
    "📋 First job isActive value:",
    rows[0]?.isActive,
    "Type:",
    typeof rows[0]?.isActive,
  );
  return rows;
};

// Get jobs by location
exports.getJobsByLocation = async (state, city, limit = 20, offset = 0) => {
  return Job.find({ ...ACTIVE_JOB_FILTER, state, city })
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();
};

// Search jobs by multiple criteria
exports.searchJobs = async (filters, limit = 20, offset = 0) => {
  const query = { ...ACTIVE_JOB_FILTER };

  if (filters.state) query.state = filters.state;
  if (filters.city) query.city = filters.city;
  if (filters.category) query.category = filters.category;
  if (filters.salary_min)
    query.salary_min = { $gte: Number(filters.salary_min) };
  if (filters.salary_max) {
    query.salary_max = {
      ...(query.salary_max || {}),
      $lte: Number(filters.salary_max),
    };
  }
  if (filters.keyword) {
    query.$or = [
      { title: { $regex: filters.keyword, $options: "i" } },
      { description: { $regex: filters.keyword, $options: "i" } },
    ];
  }

  return Job.find(query)
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();
};

// Update job
exports.updateJob = async (jobId, updateData) => {
  const safeUpdate = { ...updateData, updated_at: new Date() };
  if (safeUpdate.location_state !== undefined) {
    safeUpdate.state = safeUpdate.location_state;
    delete safeUpdate.location_state;
  }
  if (safeUpdate.location_city !== undefined) {
    safeUpdate.city = safeUpdate.location_city;
    delete safeUpdate.location_city;
  }
  if (safeUpdate.required_skills !== undefined) {
    safeUpdate.requirements = safeUpdate.required_skills;
    delete safeUpdate.required_skills;
  }

  await Job.updateOne({ id: Number(jobId) }, { $set: safeUpdate });
  return exports.getJobById(jobId);
};

// Close/close job posting
exports.closeJob = async (jobId) => {
  await Job.updateOne(
    { id: Number(jobId) },
    { $set: { is_active: 0, isActive: 0, updated_at: new Date() } },
  );
};

// Delete job
exports.deleteJob = async (jobId) => {
  const result = await Job.deleteOne({ id: Number(jobId) });
  return result.deletedCount;
};

// Get jobs by category
exports.getJobsByCategory = async (category, limit = 20, offset = 0) => {
  return Job.find({ ...ACTIVE_JOB_FILTER, category })
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();
};

// Count total active jobs
exports.countActiveJobs = async () => {
  return Job.countDocuments(ACTIVE_JOB_FILTER);
};

// Toggle like/unlike job (save/unsave)
exports.toggleLikeJob = async (userId, jobId) => {
  const uid = Number(userId);
  const jid = Number(jobId);
  const existing = await SavedJob.findOne({ user_id: uid, job_id: jid }).lean();

  if (existing) {
    await SavedJob.deleteOne({ user_id: uid, job_id: jid });
    return false;
  }

  await SavedJob.create({ user_id: uid, job_id: jid, created_at: new Date() });
  return true;
};

// Get all liked jobs by user
exports.getLikedJobs = async (userId, limit = 20, offset = 0) => {
  const saved = await SavedJob.find({ user_id: Number(userId) })
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();

  const jobIds = saved.map((s) => s.job_id);
  const jobs = await Job.find({ id: { $in: jobIds } }).lean();
  const jobsMap = new Map(jobs.map((j) => [j.id, j]));

  return saved
    .map((s) => {
      const job = jobsMap.get(s.job_id);
      return job ? { ...job, saved_at: s.created_at } : null;
    })
    .filter(Boolean);
};

// Check if job is liked by user
exports.isJobLiked = async (userId, jobId) => {
  const existing = await SavedJob.findOne({
    user_id: Number(userId),
    job_id: Number(jobId),
  }).lean();
  return !!existing;
};

module.exports = exports;
