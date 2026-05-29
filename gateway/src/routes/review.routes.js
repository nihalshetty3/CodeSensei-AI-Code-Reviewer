const express = require("express");
const router = express.Router();

const {
    reviewCode
} = require("../controllers/review.controller");

router.post("/review", reviewCode);
module.exports = router;