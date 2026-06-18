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
const { verify } = require("jsonwebtoken");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/review", verifyToken,reviewCode);
router.post("/pr-review", verifyToken,prReview);
router.post("/repository-review",verifyToken, repositoryReview);
router.post("/upload-review",verifyToken, upload.array("files"), uploadReview);
router.post("/upload-zip-review",verifyToken, upload.single("file"), uploadZipReview);

module.exports = router;
