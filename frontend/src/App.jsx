import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import SeekerDashboard from "./pages/SeekerDashboardNew";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobDetails from "./pages/JobDetails";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";

const DashboardRedirect = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return <Navigate to="/login" replace />;

    const user = JSON.parse(storedUser);
    if (user?.role === "employer")
      return <Navigate to="/employer-dashboard" replace />;
    if (user?.role === "seeker")
      return <Navigate to="/seeker-dashboard" replace />;
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
  } catch (error) {
    // Fall back to login if local storage data is invalid.
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
