// Additional backend controller for users
const db = require('../config/database');

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, phone, role, location, skills, bio, createdAt FROM users LIMIT 100'
    );
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const [users] = await db.query(
      'SELECT id, name, email, phone, role, location, skills, bio, createdAt FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, location, skills, bio } = req.body;

    await db.query(
      'UPDATE users SET name = ?, phone = ?, location = ?, skills = ?, bio = ?, updatedAt = NOW() WHERE id = ?',
      [name, phone, location, skills, bio, userId]
    );

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query, role } = req.query;

    let sql = 'SELECT id, name, email, phone, role, location, skills, bio FROM users WHERE 1=1';
    const params = [];

    if (query) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR skills LIKE ?)';
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    sql += ' LIMIT 50';

    const [users] = await db.query(sql, params);

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
