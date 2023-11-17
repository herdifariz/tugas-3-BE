const express = require("express");
const router = express.Router();

const {
  getAllUser,
  getUserById,
  postUser,
  deleteUser,
  loginHandler,
} = require("../controller/user");

// GET All User
router.get("/users/fetch-all", getAllUser);

// GET User by Id
router.get("/users/:userId", getUserById);

// Register new User
router.post("/users/register", postUser);

// LOGIN User
router.post("/users/login", loginHandler);

// PUT /users
// router.put()

// DELETE /users/:userId
router.delete("/users/:userId", deleteUser);

module.exports = router;
