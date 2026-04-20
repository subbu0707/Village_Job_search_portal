import React, { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "../StarRating/StarRating";
import "./RatingsDisplay.css";

const RatingsDisplay = ({ seekerId }) => {
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRatings();
  }, [seekerId]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/ratings/seeker/${seekerId}`
      );
      setRatingsData(response.data);
    } catch (err) {
      setError("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="ratings-loading">Loading ratings...</div>;
  }

  if (error) {
    return <div className="ratings-error">{error}</div>;
  }

  if (!ratingsData || ratingsData.totalRatings === 0) {
    return (
      <div className="ratings-empty">
        <p>No ratings yet</p>
      </div>
    );
  }

  const { averageRating, totalRatings, ratings } = ratingsData;

  // Calculate average metrics
  const avgMetrics = {
    punctuality: 0,
    workQuality: 0,
    communication: 0,
    professionalism: 0,
  };

  if (ratings.length > 0) {
    ratings.forEach((r) => {
      avgMetrics.punctuality += r.punctuality || 0;
      avgMetrics.workQuality += r.workQuality || 0;
      avgMetrics.communication += r.communication || 0;
      avgMetrics.professionalism += r.professionalism || 0;
    });

    Object.keys(avgMetrics).forEach((key) => {
      avgMetrics[key] = (avgMetrics[key] / ratings.length).toFixed(1);
    });
  }

  return (
    <div className="ratings-display">
      <div className="ratings-summary">
        <div className="average-rating">
          <h3>Overall Rating</h3>
          <div className="rating-value">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <StarRating
              rating={Math.round(averageRating)}
              readOnly
              size="large"
            />
          </div>
          <p className="rating-count">
            Based on {totalRatings} {totalRatings === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="performance-metrics">
          <h3>Performance Breakdown</h3>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Punctuality</span>
              <StarRating
                rating={Math.round(avgMetrics.punctuality)}
                readOnly
                size="small"
              />
              <span className="metric-value">{avgMetrics.punctuality}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Work Quality</span>
              <StarRating
                rating={Math.round(avgMetrics.workQuality)}
                readOnly
                size="small"
              />
              <span className="metric-value">{avgMetrics.workQuality}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Communication</span>
              <StarRating
                rating={Math.round(avgMetrics.communication)}
                readOnly
                size="small"
              />
              <span className="metric-value">{avgMetrics.communication}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Professionalism</span>
              <StarRating
                rating={Math.round(avgMetrics.professionalism)}
                readOnly
                size="small"
              />
              <span className="metric-value">{avgMetrics.professionalism}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ratings-list">
        <h3>Recent Reviews</h3>
        {ratings.map((rating) => (
          <div key={rating.id} className="rating-card">
            <div className="rating-header">
              <div>
                <h4>{rating.employerName}</h4>
                <p className="job-title">{rating.jobTitle}</p>
              </div>
              <div className="rating-info">
                <StarRating
                  rating={Math.round(rating.rating)}
                  readOnly
                  size="small"
                />
                <span className="rating-date">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {rating.review && <p className="rating-review">{rating.review}</p>}
            <div className="rating-metrics">
              <span>
                <strong>Punctuality:</strong> {rating.punctuality}/5
              </span>
              <span>
                <strong>Quality:</strong> {rating.workQuality}/5
              </span>
              <span>
                <strong>Communication:</strong> {rating.communication}/5
              </span>
              <span>
                <strong>Professional:</strong> {rating.professionalism}/5
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsDisplay;
