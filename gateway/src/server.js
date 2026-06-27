require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("./config/db");

const reviewRoutes = require("./routes/review.routes");
const githubAuthRoutes = require("./routes/githubAuth.routes");
const githubRepoRoutes = require("./routes/githubRepo.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          "http://localhost:8000/api/auth/github/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken;
        done(null, profile);
      }
    )
  );
} else if (process.env.NODE_ENV !== "production") {
  console.log("[dev] GitHub OAuth skipped.");
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.send("CodeSensei Gateway Running 🚀");
});

app.use("/api", reviewRoutes);
app.use("/api/auth", githubAuthRoutes);
app.use("/api/github", githubRepoRoutes);
app.use("/api/history", historyRoutes);

const server = app.listen(PORT, () => {
  console.log(`🚀 Gateway running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }
  throw err;
});