const axios = require("axios");

const reviewCode = async (req , res) =>{

    try{
        const response = await axios.post(
            "http://localhost:8001/review",
            req.body
        );

        res.json(response.data);
    }

    catch(err){
        res.status(500).json({
            succes:false,
            message:"Error communicating with AI service"
        });
    }
};

module.exports = {
    reviewCode
};
