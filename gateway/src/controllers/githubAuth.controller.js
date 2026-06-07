const jwt = require("jsonwebtoken");


const githubCallback = async (req, res) => {
  try {
    const token = jwt.sign(
      {
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
