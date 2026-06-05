const express = require("express");

const router = express.Router();

const {
  getReviewHistory,
  getReviewById,
  createReview,
} = require("../controllers/history.controller");

router.get("/", getReviewHistory);

router.get("/:id", getReviewById);

router.post("/",createReview);

module.exports = router;