require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const pool = require("./config/db");

// Routes
const reviewRoutes = require("./routes/review.routes");
const githubAuthRoutes = require("./routes/githubAuth.routes");
const githubRepoRoutes = require("./routes/githubRepo.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();
const PORT = process.env.PORT || 8000;

// 1. Core Middleware (CORS & Body Parser)
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// 2. Session & Passport Middleware
app.use(
  session({
    secret: process.env.JWT_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 3. Passport GitHub Strategy Configuration
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/api/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        return done(null, profile);
      }
    )
  );
} else if (process.env.NODE_ENV !== "production") {
  console.log(
    "[dev] GitHub OAuth skipped — localhost uses mock Connect GitHub. Add GITHUB_CLIENT_ID/SECRET to gateway/.env for real OAuth."
  );
}

// 4. API Routes
app.get("/", (req, res) => {
  res.send("CodeSensei Gateway Running");
});

app.use("/api", reviewRoutes);
app.use("/api/auth", githubAuthRoutes);
app.use("/api/github", githubRepoRoutes);
app.use("/api/history", historyRoutes);

// 5. Server Initialization & Port Handling
const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Run: npm run predev (or: lsof -ti :${PORT} | xargs kill -9)`
    );
    process.exit(1);
  }
  throw err;
});