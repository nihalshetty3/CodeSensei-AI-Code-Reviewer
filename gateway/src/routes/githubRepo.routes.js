const express = require("express");

const verifyToken = 
require("../middleware/auth.middleware");

const {
    getRepositories
}= require("../controllers/githubRepo.controller");
const { get } = require("./githubAuth.routes");

const router = express.Router();

router.get(
    "/repos",
    verifyToken,
    getRepositories
);

module.exports = router;