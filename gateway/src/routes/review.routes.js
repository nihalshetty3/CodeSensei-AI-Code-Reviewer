const express = require("express");
const router = express.Router();

router.post("/review" , (req , res) =>{
    res.json({
        success:true,
        message: "Review endpoint working",
    });
});

module.exports = router;