const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const router = express.Router();
const {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} = require("../controller/comments");

router
  .route("/")
  .get(getComments)
  .post(protect, authorize("admin", "Operator", "user "), createComment);

router
  .route("/:id")
  .get(getComment)
  .put(protect, authorize("admin", "Operator", "user "), updateComment)
  .delete(protect, authorize("admin", "Operator", "user "), deleteComment);

module.exports = router;
