// Middleware for role-based access control
exports.authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }

    next();
  };
};

exports.isEmployer = (req, res, next) => {
  if (req.user?.role !== 'employer') {
    return res.status(403).json({
      success: false,
      message: 'Only employers can access this resource'
    });
  }
  next();
};

exports.isSeeker = (req, res, next) => {
  if (req.user?.role !== 'seeker') {
    return res.status(403).json({
      success: false,
      message: 'Only job seekers can access this resource'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can access this resource'
    });
  }
  next();
};

module.exports = exports;
