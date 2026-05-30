const express = require("express");
const cors = require("cors");

const reviewRoutes = require("./routes/review.routes");

const app = express();

const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api", reviewRoutes);

app.get("/", (req, res) => {
  res.send("CodeSensei Gateway Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});