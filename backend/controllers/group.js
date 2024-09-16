const Group = require("../models/group");

// Create group
const createGroup = async (req, res) => {
  const { name, description } = req.body;
  try {
    const group = new Group({
      name,
      description,
      admin: req.user._id, // Set the creator as the admin
    });
    await group.save();
    res.status(201).json({ message: "Group created", group });
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
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this group" });
    }

    await Group.findByIdAndDelete(id);
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add member
const addMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to add members" });
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }
    res.json({ message: "Member added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to remove members" });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    await group.save();
    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this group" });
    }

    group.name = name || group.name;
    group.description = description || group.description;
    await group.save();
    res.json({ message: "Group updated", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ admin: req.user._id });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchGroups = async (req, res) => {
  const { name } = req.query;
  try {
    const groups = await Group.find({
      name: new RegExp(name, "i"),
      admin: req.user._id,
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroup,
  deleteGroup,
  addMember,
  removeMember,
  updateGroup,
  getUserGroups,
  searchGroups,
};
