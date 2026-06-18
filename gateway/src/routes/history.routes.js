const express = require("express");

const router = express.Router();

const {
  getReviewHistory,
  getReviewStats,
  clearReviewHistory
} = require("../controllers/history.controller");
const verifyToken = require("../middleware/auth.middleware");

router.get("/", verifyToken,getReviewHistory);

router.get("/stats",verifyToken,getReviewStats);

router.delete("/delete",verifyToken,clearReviewHistory);



module.exports = router;