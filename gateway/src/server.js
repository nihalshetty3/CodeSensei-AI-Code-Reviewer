
const express = require("express");

const reviewRoutes = require("./routes/review.routes");
const cors = require("cors");
const app = express();
app.use(cors());

const PORT = 8000;

app.use(express.json());
app.use("/api" , reviewRoutes);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("CodeSensei Gateway Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});   