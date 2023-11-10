const express = require("express");
const router = express.Router();

const {
  getAllUser,
  getUserById,
  postUser,
  deleteUser,
} = require("../controller/user");

// GET /users (ENDPOINT 1)
router.get("/users", getAllUser);

// GET /users/:userId -> GET /users/1
router.get("/users/:userId", getUserById);

// POST /users
router.post("/users", postUser);

// PUT /users
// router.put()

// DELETE /users/:userId
router.delete("/users/:userId", deleteUser);

module.exports = router;
