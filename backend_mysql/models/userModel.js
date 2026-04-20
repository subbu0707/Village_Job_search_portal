// backend_mysql/models/userModel.js
const User = require("./mongo/User");
const { getNextId } = require("../utils/nextId");

const toPlain = (doc) => (doc ? doc.toObject() : null);

// Create a new user
exports.createUser = async (userData) => {
  const { email, password, name, role, phone, state, city, language } =
    userData;

  const id = await getNextId("users");

  const created = await User.create({
    id,
    email,
    password,
    name,
    role,
    phone: phone || null,
    state: state || null,
    city: city || null,
    language: language || "en",
    created_at: new Date(),
    updated_at: new Date(),
  });

  return created.id;
};

// Find user by email
exports.findByEmail = async (email) => {
  const row = await User.findOne({ email }).lean();
  return row || null;
};

// Find user by ID
exports.findById = async (id) => {
  const row = await User.findOne({ id: Number(id) }).lean();
  return row || null;
};

// Get all users (for admin)
exports.getAllUsers = async (limit = 20, offset = 0) => {
  return User.find(
    {},
    {
      _id: 0,
      id: 1,
      email: 1,
      name: 1,
      role: 1,
      phone: 1,
      state: 1,
      city: 1,
      language: 1,
      created_at: 1,
    },
  )
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();
};

// Get users by role
exports.getUsersByRole = async (role, limit = 20, offset = 0) => {
  return User.find(
    { role },
    {
      _id: 0,
      id: 1,
      email: 1,
      name: 1,
      role: 1,
      phone: 1,
      state: 1,
      city: 1,
      language: 1,
      created_at: 1,
    },
  )
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();
};

// Update user profile
exports.updateProfile = async (userId, updateData) => {
  const { name, phone, state, city, language, bio, skills } = updateData;
  const update = { updated_at: new Date() };

  if (name !== undefined) update.name = name;
  if (phone !== undefined) update.phone = phone;
  if (state !== undefined) update.state = state;
  if (city !== undefined) update.city = city;
  if (language !== undefined) update.language = language;
  if (bio !== undefined) update.bio = bio;
  if (skills !== undefined) update.skills = skills;

  const updated = await User.findOneAndUpdate(
    { id: Number(userId) },
    { $set: update },
    { new: true },
  );

  return toPlain(updated);
};

// Update user password
exports.updatePassword = async (userId, hashedPassword) => {
  await User.updateOne(
    { id: Number(userId) },
    { $set: { password: hashedPassword, updated_at: new Date() } },
  );
};

// Delete user
exports.deleteUser = async (userId) => {
  const result = await User.deleteOne({ id: Number(userId) });
  return result.deletedCount;
};

// Count users by role
exports.countByRole = async (role) => {
  return User.countDocuments({ role });
};

// Update terms acceptance
exports.updateTermsAcceptance = async (userId) => {
  await User.updateOne(
    { id: Number(userId) },
    {
      $set: {
        terms_accepted: true,
        terms_accepted_at: new Date(),
        updated_at: new Date(),
      },
    },
  );
};

module.exports = exports;
