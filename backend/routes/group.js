const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/admin");
const {
  createGroup,
  deleteGroup,
  updateGroup,
  getUserGroups,
  getGroupById,
} = require("../controllers/group");
const { verifyUser } = require("../middlewares/auth");

router.get("/users/all", verifyUser, getUsers);
router.get("/", verifyUser, getUserGroups);
router.post("/", verifyUser, createGroup);
router.delete("/:id", verifyUser, deleteGroup);
router.put("/:id", verifyUser, updateGroup);
router.get("/:id", verifyUser, getGroupById);

module.exports = router;
