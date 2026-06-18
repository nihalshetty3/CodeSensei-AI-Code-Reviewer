const jwt = require("jsonwebtoken");
const pool=require("../config/db.js");

const githubCallback = async (req, res) => {
  try {
    const githubId=req.user.id;
    const username=req.user.username;
    let result=await pool.query(
       "SELECT * FROM users WHERE github_id=$1",[githubId]
    );

    let dbUser;

    if(result.rows.length === 0){ 
         result=await pool.query(
          `INSERT INTO users(github_id,username)
          VALUES($1,$2)
          RETURNING * `,[githubId,username]
         );
         dbUser=result.rows[0];
    }else{
         dbUser=result.rows[0];
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
