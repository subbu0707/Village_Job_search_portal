import React from "react";
import "./StarRating.css";

const StarRating = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = "medium",
}) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "star-small";
      case "large":
        return "star-large";
      default:
        return "star-medium";
    }
  };

  return (
    <div className={`star-rating ${readOnly ? "read-only" : "interactive"}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${
            star <= rating ? "filled" : "empty"
          } ${getSizeClass()}`}
          onClick={() => handleClick(star)}
          style={{ cursor: readOnly ? "default" : "pointer" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
