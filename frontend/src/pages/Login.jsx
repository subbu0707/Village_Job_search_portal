import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import TermsModal from "../components/TermsModal";
import api from "../api/api";
import "../styles/Login.css";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginRole: "seeker",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.loginRole) {
      newErrors.loginRole = "Please select seeker or employer";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleTermsAccept = () => {
    setFormData({ ...formData, termsAccepted: true });
    setShowTermsModal(false);
    if (errors.termsAccepted) {
      setErrors({ ...errors, termsAccepted: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError("");

    try {
      const response = await api.post("/auth/login", formData);
      console.log("Login response:", response.data);

      // Backend returns data in response.data.data
      const { token, ...user } = response.data.data;

      login(token, user);

      // Redirect only based on selected dropdown role
      if (formData.loginRole === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/seeker-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setGeneralError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Floating decorative circles */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

      {/* Language Selector at top */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <LanguageSelector />
      </div>

      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Login to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {generalError && (
            <div className="general-error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {generalError}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">
              Email <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="form-group">
            <label className="form-label">
              Login As <span className="required">*</span>
            </label>
            <select
              name="loginRole"
              value={formData.loginRole}
              onChange={handleChange}
              className={`form-input role-select ${errors.loginRole ? "error" : ""}`}
            >
              <option value="seeker">Seeker</option>
              <option value="employer">Employer</option>
            </select>
            {errors.loginRole && (
              <span className="error-message">{errors.loginRole}</span>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="form-group terms-group">
            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="terms-checkbox"
              />
              <span className="terms-text">
                {t("I accept the")}{" "}
                <button
                  type="button"
                  className="terms-link"
                  onClick={() => setShowTermsModal(true)}
                >
                  {t("Terms and Conditions")}
                </button>{" "}
                <span className="required">*</span>
              </span>
            </label>
            {errors.termsAccepted && (
              <span className="error-message terms-error">
                {t(errors.termsAccepted)}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Login to Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>Don't have an account?</p>
          <Link to="/register" className="register-link">
            Create Account
          </Link>
        </div>

        {/* Back to Home */}
        <div className="back-home">
          <Link to="/" className="home-link">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
      />
    </div>
  );
};

export default Login;
