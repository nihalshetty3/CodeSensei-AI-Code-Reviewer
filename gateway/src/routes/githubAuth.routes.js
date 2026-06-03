const express = require("express");
const passport = require("passport");

const {
    githubCallback,
} = require("../controllers/githubAuth.controller");

const router = express.Router();

router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email" , "repo"],
    })
);

router.get(
    "/github/callback",
    passport.authenticate("github" , {
        session: false,
    }),
    githubCallback
);

module.exports = router;