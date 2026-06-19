const jwt = require("jsonwebtoken");
const prisma=require("../config/prisma");
const { use } = require("passport");

const githubCallback = async (req, res) => {
  try {
    const githubId=String(req.user.id);
    const username=req.user.username;

   let dbUser=await prisma.user.findUnique({
    where:{
      github_id:githubId
    },
   });

   if(!dbUser){
       dbUser=await prisma.user.create({
        data:{
             github_id:githubId,
             username:username,
        },
       });
   }

    const token = jwt.sign(
      { 
        userID:dbUser.id,
        githubid: req.user.id,
        username: req.user.username,
        accessToken: req.user.accessToken,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.redirect(
      `http://localhost:5173/auth/success?token=${token}`
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  githubCallback,
};
