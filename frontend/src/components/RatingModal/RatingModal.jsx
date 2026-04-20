import React, { useState } from "react";
import axios from "axios";
import StarRating from "../StarRating/StarRating";
import "./RatingModal.css";

const RatingModal = ({
  isOpen,
  onClose,
  jobId,
  seekerId,
  seekerName,
  jobTitle,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [metrics, setMetrics] = useState({
    punctuality: 0,
    workQuality: 0,
    communication: 0,
    professionalism: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMetricChange = (metric, value) => {
    setMetrics((prev) => ({ ...prev, [metric]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please provide an overall rating");
      return;
    }

    if (
      metrics.punctuality === 0 ||
      metrics.workQuality === 0 ||
      metrics.communication === 0 ||
      metrics.professionalism === 0
    ) {
      setError("Please rate all performance metrics");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/ratings",
        {
          jobId,
          seekerId,
          rating,
          review,
          ...metrics,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rating-modal-overlay" onClick={onClose}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rating-modal-header">
          <h2>Rate Worker Performance</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="rating-modal-body">
          <div className="job-info">
            <p>
              <strong>Worker:</strong> {seekerName}
            </p>
            <p>
              <strong>Job:</strong> {jobTitle}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <label>Overall Rating *</label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="large"
              />
            </div>

            <div className="metrics-section">
              <h3>Performance Metrics</h3>

              <div className="metric-item">
                <label>Punctuality *</label>
                <StarRating
                  rating={metrics.punctuality}
                  onRatingChange={(value) =>
                    handleMetricChange("punctuality", value)
                  }
                />
              </div>

              <div className="metric-item">
                <label>Work Quality *</label>
                <StarRating
                  rating={metrics.workQuality}
                  onRatingChange={(value) =>
                    handleMetricChange("workQuality", value)
                  }
                />
              </div>

              <div className="metric-item">
                <label>Communication *</label>
                <StarRating
                  rating={metrics.communication}
                  onRatingChange={(value) =>
                    handleMetricChange("communication", value)
                  }
                />
              </div>

              <div className="metric-item">
                <label>Professionalism *</label>
                <StarRating
                  rating={metrics.professionalism}
                  onRatingChange={(value) =>
                    handleMetricChange("professionalism", value)
                  }
                />
              </div>
            </div>

            <div className="review-section">
              <label>Review (Optional)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience working with this person..."
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
