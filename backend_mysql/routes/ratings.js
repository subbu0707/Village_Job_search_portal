const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const Job = require("../models/mongo/Job");
const Application = require("../models/mongo/Application");
const Rating = require("../models/mongo/Rating");
const User = require("../models/mongo/User");

// Submit a rating for a job seeker
router.post("/", authenticate, async (req, res) => {
  const employerId = Number(req.user.id);
  const {
    jobId,
    seekerId,
    rating,
    review,
    punctuality,
    workQuality,
    communication,
    professionalism,
  } = req.body;

  try {
    console.log("📝 Submitting rating:", {
      jobId,
      seekerId,
      employerId,
      rating,
    });

    // Verify the employer posted this job
    const job = await Job.findOne({
      id: Number(jobId),
      employer_id: employerId,
    }).lean();

    if (!job) {
      console.log("❌ Job verification failed - not employer's job");
      return res
        .status(403)
        .json({ message: "You can only rate workers for your own jobs" });
    }

    console.log("✅ Job verified for employer");

    // Verify the seeker applied and was accepted for this job
    const application = await Application.findOne({
      job_id: Number(jobId),
      user_id: Number(seekerId),
    }).lean();

    if (!application) {
      console.log("❌ Application not found");
      return res.status(400).json({
        message: "Can only rate seekers who were accepted for this job",
      });
    }

    if (
      application.status !== "accepted" &&
      application.status !== "completed"
    ) {
      console.log(
        "❌ Application not accepted/completed, status:",
        application.status,
      );
      return res.status(400).json({
        message:
          "Can only rate seekers who were accepted or completed for this job",
      });
    }

    console.log("✅ Application verified");

    // Insert or update rating
    console.log("💾 Inserting rating into database...");
    await Rating.findOneAndUpdate(
      {
        jobId: Number(jobId),
        seekerId: Number(seekerId),
        employerId,
      },
      {
        $set: {
          rating,
          review,
          punctuality,
          workQuality,
          communication,
          professionalism,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    console.log("✅ Rating inserted");

    // Mark application as rated (use camelCase: isRated)
    console.log("🔄 Marking application as rated...");
    await Application.updateOne(
      { job_id: Number(jobId), user_id: Number(seekerId) },
      { $set: { isRated: 1, updated_at: new Date() } },
    );

    console.log("✅ Application marked as rated");

    // Update user's average rating
    console.log("📊 Calculating average rating for seeker...");
    const stats = await Rating.aggregate([
      { $match: { seekerId: Number(seekerId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const avgResult = stats[0] || { avgRating: 0, totalRatings: 0 };

    console.log(
      "📈 Average rating:",
      avgResult.avgRating,
      "Total ratings:",
      avgResult.totalRatings,
    );

    const finalAvgRating = avgResult.avgRating
      ? Number(avgResult.avgRating)
      : 0;
    const finalTotalRatings = avgResult.totalRatings || 0;

    await User.updateOne(
      { id: Number(seekerId) },
      {
        $set: {
          averageRating: finalAvgRating,
          totalRatings: finalTotalRatings,
          updated_at: new Date(),
        },
      },
    );

    console.log("✅ User average rating updated");

    res.json({
      message: "Rating submitted successfully",
      averageRating: finalAvgRating,
      totalRatings: finalTotalRatings,
    });
  } catch (error) {
    console.error("❌ Error submitting rating:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Failed to submit rating" });
  }
});

// Get ratings for a specific seeker
router.get("/seeker/:seekerId", async (req, res) => {
  const seekerId = Number(req.params.seekerId);

  try {
    const ratingsRaw = await Rating.find({ seekerId })
      .sort({ createdAt: -1 })
      .lean();
    const jobIds = [...new Set(ratingsRaw.map((r) => Number(r.jobId)))];
    const employerIds = [
      ...new Set(ratingsRaw.map((r) => Number(r.employerId))),
    ];

    const [jobs, employers, user] = await Promise.all([
      Job.find({ id: { $in: jobIds } }, { _id: 0, id: 1, title: 1 }).lean(),
      User.find(
        { id: { $in: employerIds } },
        { _id: 0, id: 1, name: 1 },
      ).lean(),
      User.findOne(
        { id: seekerId },
        { _id: 0, averageRating: 1, totalRatings: 1 },
      ).lean(),
    ]);

    const jobsMap = new Map(jobs.map((j) => [j.id, j.title]));
    const employersMap = new Map(employers.map((e) => [e.id, e.name]));

    const ratings = ratingsRaw.map((r) => ({
      ...r,
      jobTitle: jobsMap.get(Number(r.jobId)) || null,
      employerName: employersMap.get(Number(r.employerId)) || null,
    }));

    res.json({
      averageRating: user?.averageRating || 0,
      totalRatings: user?.totalRatings || 0,
      ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
});

// Get list of completed jobs that can be rated (for employers)
router.get("/pending", authenticate, async (req, res) => {
  const employerId = Number(req.user.id);

  try {
    console.log("📊 Fetching pending ratings for employer:", employerId);

    const employerJobs = await Job.find(
      { employer_id: employerId },
      { _id: 0, id: 1, title: 1 },
    ).lean();
    const jobMap = new Map(employerJobs.map((j) => [j.id, j.title]));
    const jobIds = employerJobs.map((j) => j.id);

    const applications = await Application.find({
      job_id: { $in: jobIds },
      status: { $in: ["accepted", "completed"] },
      completedAt: { $ne: null },
      $or: [{ isRated: 0 }, { isRated: null }, { isRated: { $exists: false } }],
    })
      .sort({ completedAt: -1 })
      .lean();

    const seekerIds = [...new Set(applications.map((a) => Number(a.user_id)))];
    const seekers = await User.find(
      { id: { $in: seekerIds } },
      { _id: 0, id: 1, name: 1, profile_image: 1 },
    ).lean();
    const seekerMap = new Map(seekers.map((s) => [s.id, s]));

    const pendingRatings = applications.map((a) => ({
      applicationId: a.id,
      jobId: a.job_id,
      seekerId: a.user_id,
      completedAt: a.completedAt,
      isRated: a.isRated,
      status: a.status,
      jobTitle: jobMap.get(Number(a.job_id)) || null,
      seekerName: seekerMap.get(Number(a.user_id))?.name || null,
      seekerPhoto: seekerMap.get(Number(a.user_id))?.profile_image || null,
    }));

    console.log("✅ Found pending ratings:", pendingRatings.length);
    res.json(pendingRatings);
  } catch (error) {
    console.error("❌ Error fetching pending ratings:", error);
    res.status(500).json({ message: "Failed to fetch pending ratings" });
  }
});

// Mark job as completed (for employers)
router.post("/complete-job", authenticate, async (req, res) => {
  const employerId = Number(req.user.id);
  const { jobId, seekerId } = req.body;

  try {
    console.log("🔍 Complete-job request:", { employerId, jobId, seekerId });

    // Verify the employer owns this job
    const job = await Job.findOne({
      id: Number(jobId),
      employer_id: employerId,
    }).lean();

    console.log("📋 Found job:", job);

    if (!job) {
      console.log("❌ No jobs found or unauthorized");
      return res
        .status(403)
        .json({ message: "Unauthorized - You don't own this job" });
    }

    // Check if application exists
    const application = await Application.findOne({
      job_id: Number(jobId),
      user_id: Number(seekerId),
    });

    console.log("📋 Found application:", application);

    if (!application) {
      return res.status(400).json({
        message: "No application found for this job and seeker",
      });
    }

    if (application.status !== "accepted") {
      return res.status(400).json({
        message: `Cannot complete application with status: ${application.status}. Only accepted applications can be marked as completed.`,
      });
    }

    // Mark application as completed (update both completedAt and status)
    console.log("💾 Updating application to completed status...");
    application.completedAt = new Date();
    application.status = "completed";
    application.updated_at = new Date();
    await application.save();

    console.log("✅ Update result: completed");

    res.json({
      message: "Job marked as completed successfully",
      success: true,
    });
  } catch (error) {
    console.error("❌ Error completing job:", error);
    res
      .status(500)
      .json({ message: "Failed to complete job: " + error.message });
  }
});

module.exports = router;
