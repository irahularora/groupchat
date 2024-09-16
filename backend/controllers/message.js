const Message = require("../models/message");
const Group = require("../models/group");

const sendMessage = async (req, res) => {
  const { groupId, text } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Check if the user is a member or admin of the group
    if (
      group.admin.toString() !== req.user._id.toString() &&
      !group.members.includes(req.user._id)
    ) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to send messages in this group",
        });
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

    if (!message.likes.includes(req.user._id)) {
      message.likes.push(req.user._id);
      await message.save();
    }
    res.json({ message: "Message liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendMessage, likeMessage };
