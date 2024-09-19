const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  const { username, password, is_admin } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already taken" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, is_admin });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, is_admin } = req.body;

  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const updateData = {is_admin: is_admin};
  if (username) {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ error: "Username already taken" });
    }
    updateData.username = username;
  }

  if (password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    } catch (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords from the result
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  editUser,
  removeUser,
  getUsers,
};
