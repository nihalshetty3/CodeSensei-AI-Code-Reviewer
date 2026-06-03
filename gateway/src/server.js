require("dotenv").config();

const passport = require("passport");
const GitHubStrategy =
require("passport-github2").Strategy;

const session = require("express-session");

const express = require("express");
const cors = require("cors");

const reviewRoutes = require("./routes/review.routes");
const githubAuthRoutes = require("./routes/githubAuth.routes");
const githubRepoRoutes = 
require("./routes/githubRepo.routes");

passport.use(
  new GitHubStrategy(
    {
    clientID:
      process.env.GITHUB_CLIENT_ID,

    clientSecret:
      process.env.GITHUB_CLIENT_SECRET,

    callbackURL:
      "http://localhost:8000/api/auth/github/callback",
    },

    function (
      accessToken,
      refreshToken,
      profile,
      done
    ){
      profile.accessToken = accessToken;

      return done(null , profile);
    }
  )
);

const app = express();

const PORT = 8000;

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  "/api/github",
  githubRepoRoutes
)

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api", reviewRoutes);

app.use(
  "/api/auth",
  githubAuthRoutes
);

app.get("/", (req, res) => {
  res.send("CodeSensei Gateway Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});