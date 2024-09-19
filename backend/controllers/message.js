const Message = require("../models/message");
const Group = require("../models/group");

const sendMessage = async (req, res) => {
  const { groupId, text } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (
      group.admin.toString() !== req.user._id.toString() &&
      !group.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "You are not authorized to send messages in this group" });
    }

    const message = new Message({ groupId, text, sender: req.user._id });
    await message.save();
    res.status(201).json({ message: "Message sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeMessage = async (req, res) => {
  const { messageId } = req.body;
  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const userId = req.user._id;
    const isLiked = message.likes.includes(userId);

    if (isLiked) {
      message.likes = message.likes.filter(id => id.toString() !== userId.toString());
      await message.save();
      res.json({ message: "Message unliked" });
    } else {
      message.likes.push(userId);
      await message.save();
      res.json({ message: "Message liked" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessagesByGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (
      group.admin.toString() !== req.user._id.toString() &&
      !group.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "You are not authorized to view messages in this group" });
    }

    const messages = await Message.find({ groupId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 }); 

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendMessage, likeMessage, getMessagesByGroup };
