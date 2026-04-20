// backend_mysql/models/applicationModel.js
const Application = require("./mongo/Application");
const Job = require("./mongo/Job");
const User = require("./mongo/User");
const { getNextId } = require("../utils/nextId");

// Create a new application
exports.createApplication = async (appData) => {
  const { job_id, seeker_id, status } = appData;

  const id = await getNextId("applications");
  await Application.create({
    id,
    job_id: Number(job_id),
    user_id: Number(seeker_id),
    status: status || "pending",
    applied_at: new Date(),
    updated_at: new Date(),
  });

  return id;
};

// Get application by ID
exports.getApplicationById = async (appId) => {
  const app = await Application.findOne({ id: Number(appId) }).lean();
  if (!app) return null;

  const [job, seeker] = await Promise.all([
    Job.findOne({ id: Number(app.job_id) }).lean(),
    User.findOne({ id: Number(app.user_id) }).lean(),
  ]);
  const employer = job
    ? await User.findOne({ id: Number(job.employer_id) }).lean()
    : null;

  return {
    id: app.id,
    job_id: app.job_id,
    seeker_id: app.user_id,
    status: app.status,
    applied_date: app.applied_at,
    job_title: job?.title || null,
    seeker_name: seeker?.name || null,
    seeker_email: seeker?.email || null,
    employer_name: employer?.name || null,
  };
};

// Get applications for a job
exports.getApplicationsByJob = async (jobId) => {
  console.log("📋 Getting applications for job ID:", jobId);

  const apps = await Application.find({ job_id: Number(jobId) })
    .sort({ applied_at: -1 })
    .lean();

  const seekerIds = [...new Set(apps.map((a) => Number(a.user_id)))];
  const seekers = await User.find(
    { id: { $in: seekerIds } },
    { _id: 0, id: 1, name: 1, email: 1, phone: 1 },
  ).lean();
  const seekerMap = new Map(seekers.map((s) => [s.id, s]));

  const rows = apps.map((a) => ({
    id: a.id,
    job_id: a.job_id,
    seeker_id: a.user_id,
    status: a.status,
    applied_date: a.applied_at,
    seeker_name: seekerMap.get(Number(a.user_id))?.name || null,
    seeker_email: seekerMap.get(Number(a.user_id))?.email || null,
    seeker_phone: seekerMap.get(Number(a.user_id))?.phone || null,
  }));

  console.log("✅ Found", rows.length, "applications for job", jobId);
  return rows;
};

// Get applications by seeker
exports.getApplicationsBySeeker = async (seekerId) => {
  console.log("📋 Getting applications for seeker ID:", seekerId);

  const apps = await Application.find({ user_id: Number(seekerId) })
    .sort({ applied_at: -1 })
    .lean();

  const jobIds = [...new Set(apps.map((a) => Number(a.job_id)))];
  const jobs = await Job.find({ id: { $in: jobIds } }).lean();
  const jobsMap = new Map(jobs.map((j) => [j.id, j]));

  const employerIds = [...new Set(jobs.map((j) => Number(j.employer_id)))];
  const employers = await User.find(
    { id: { $in: employerIds } },
    { _id: 0, id: 1, name: 1 },
  ).lean();
  const employerMap = new Map(employers.map((e) => [e.id, e]));

  const rows = apps.map((a) => {
    const job = jobsMap.get(Number(a.job_id));
    return {
      id: a.id,
      job_id: a.job_id,
      status: a.status,
      applied_date: a.applied_at,
      job_title: job?.title || null,
      location_state: job?.state || null,
      location_city: job?.city || null,
      salary_min: job?.salary_min || null,
      salary_max: job?.salary_max || null,
      employer_name: employerMap.get(Number(job?.employer_id))?.name || null,
    };
  });

  console.log("✅ Found", rows.length, "applications for seeker", seekerId);
  return rows;
};

// Get all applications across all jobs for an employer
exports.getApplicationsByEmployer = async (employerId) => {
  console.log("📋 Getting all applications for employer ID:", employerId);

  const jobs = await Job.find(
    { employer_id: Number(employerId) },
    {
      _id: 0,
      id: 1,
      title: 1,
      state: 1,
      city: 1,
      village: 1,
      salary_min: 1,
      salary_max: 1,
      jobType: 1,
    },
  ).lean();

  if (!jobs.length) {
    return [];
  }

  const jobsMap = new Map(jobs.map((j) => [j.id, j]));
  const jobIds = jobs.map((j) => j.id);

  const apps = await Application.find({ job_id: { $in: jobIds } })
    .sort({ applied_at: -1 })
    .lean();

  if (!apps.length) {
    return [];
  }

  const seekerIds = [...new Set(apps.map((a) => Number(a.user_id)))];
  const seekers = await User.find(
    { id: { $in: seekerIds } },
    { _id: 0, id: 1, name: 1, email: 1, phone: 1, profile_image: 1 },
  ).lean();
  const seekersMap = new Map(seekers.map((s) => [s.id, s]));

  const rows = apps.map((a) => {
    const job = jobsMap.get(Number(a.job_id));
    const seeker = seekersMap.get(Number(a.user_id));

    return {
      id: a.id,
      job_id: a.job_id,
      seeker_id: a.user_id,
      status: a.status,
      applied_at: a.applied_at,
      applied_date: a.applied_at,
      seeker_name: seeker?.name || null,
      seeker_email: seeker?.email || null,
      seeker_phone: seeker?.phone || null,
      seeker_profile_picture: seeker?.profile_image || null,
      jobTitle: job?.title || null,
      jobLocation: [job?.village, job?.city, job?.state]
        .filter(Boolean)
        .join(", "),
      jobSalary:
        job?.salary_min || job?.salary_max
          ? `₹${job?.salary_min || 0} - ₹${job?.salary_max || 0}`
          : "Negotiable",
      jobType: job?.jobType || null,
    };
  });

  console.log("✅ Found", rows.length, "applications for employer", employerId);
  return rows;
};

// Update application status
exports.updateApplicationStatus = async (appId, status) => {
  await Application.updateOne(
    { id: Number(appId) },
    { $set: { status, updated_at: new Date() } },
  );
  return exports.getApplicationById(appId);
};

// Check if seeker already applied for job
exports.hasApplied = async (jobId, seekerId) => {
  const row = await Application.findOne({
    job_id: Number(jobId),
    user_id: Number(seekerId),
  }).lean();
  return !!row;
};

// Get application count by status
exports.countByStatus = async (jobId, status) => {
  return Application.countDocuments({ job_id: Number(jobId), status });
};

// Delete application
exports.deleteApplication = async (appId) => {
  const result = await Application.deleteOne({ id: Number(appId) });
  return result.deletedCount;
};

// Get total applications count
exports.countTotalApplications = async () => {
  return Application.countDocuments({});
};

module.exports = exports;
