const express = require("express");
const router = express.Router();
const {
  createUser,
  editUser,
  removeUser,
  getUsers,
} = require("../controllers/admin");
const { verifyAdmin } = require("../middlewares/auth");

router.post("/users", verifyAdmin, createUser);
router.put("/users/:id", verifyAdmin, editUser);
router.delete("/users/:id", verifyAdmin, removeUser);
router.get("/users", verifyAdmin, getUsers);

module.exports = router;
