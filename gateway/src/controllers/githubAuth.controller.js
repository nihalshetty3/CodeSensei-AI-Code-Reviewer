const jwt = require("jsonwebtoken");

const githubCallback = async (req , res) =>{
    try{
        const token = jwt.sign(
            {
                githubid : req.user.id,
                username: req.user.username,

                accessToken : req.user.accessToken
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            success: true,
            token,
            user:{
                id: req.user.id,
                username: req.user.username,
            },
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    githubCallback,
};