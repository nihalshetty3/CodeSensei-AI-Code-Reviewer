const express = require("express");

const reviewRoutes = require("./routes/review.routes");

const app = express();

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