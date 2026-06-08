const express = require("express");
const multer = require("multer");

const {
  reviewCode,
  prReview,
  repositoryReview,
  uploadReview,
  uploadZipReview,
} = require("../controllers/review.controller");
const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/review", reviewCode);
router.post("/pr-review", prReview);
router.post("/repository-review",verifyToken, repositoryReview);
router.post("/upload-review", upload.array("files"), uploadReview);
router.post("/upload-zip-review", upload.single("file"), uploadZipReview);

module.exports = router;
