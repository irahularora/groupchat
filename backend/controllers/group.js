const Group = require("../models/group");
const mongoose = require('mongoose');

const createGroup = async (req, res) => {
  const { name, description, members } = req.body;
  try {
    const group = new Group({
      name,
      description,
      admin: req.user._id, 
      members: members || []
    });
    await group.save();
    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, description, members } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this group" });
    }

    group.name = name || group.name;
    group.description = description || group.description;

    if (members) {
      group.members = members.map(memberId => new mongoose.Types.ObjectId(memberId));
    }

    await group.save();
    res.json({ message: "Group updated", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this group" });
    }

    await Group.findByIdAndDelete(id);
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { admin: req.user._id },
        { members: req.user._id }
      ]
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroup,
  deleteGroup,
  updateGroup,
  getUserGroups,
  getGroupById
};
