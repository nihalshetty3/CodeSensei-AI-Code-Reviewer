const express = require("express");

const router = express.Router();

const {
  getReviewHistory,
  
  
  getStats,
} = require("../controllers/history.controller");

router.get("/", getReviewHistory);

router.get("/stats",getStats);




module.exports = router;