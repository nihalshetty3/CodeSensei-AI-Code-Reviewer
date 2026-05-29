const axios = require("axios");

const reviewCode = async (req, res) => {

    try {

        console.log("BODY RECEIVED:", req.body);

        const response = await axios.post(
            "http://127.0.0.1:5000/review",
            {
                code: req.body.code,
                language: req.body.language
            }
        );

        res.json(response.data);

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "AI Service Error"
        });
    }
};

module.exports = {
    reviewCode
};
