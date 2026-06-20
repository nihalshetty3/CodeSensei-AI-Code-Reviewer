const prisma = require("../config/prisma");

const getReviewStats = async (req, res) => {
  try {
    const userId = req.user.userID;
    const stats = await prisma.reviewHistory.aggregate({
      where: {
        user_id: userId
      },
      _count: {
        id: true
      },
      _sum: {
        bugs_found: true,
        security_issues: true
      }
    });

    res.json({
      total_reviews: stats._count.id,
      total_bugs: stats._sum.bugs_found || 0,
      total_security: stats._sum.security_issues || 0
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const getReviewHistory = async (req, res) => {
  try {
    const userId = req.user.userID;



    const history = await prisma.reviewHistory.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        review_date: "desc"
      }
    });

    res.status(200).json(history);



  } catch (err) {
    console.error("History Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch review history",
    });
  }
}

const clearReviewHistory = async (req, res) => {
  try {
    const userId = req.user.userID;
    await prisma.reviewHistory.deleteMany({
      where: {
        user_id: userId
      }
    });

    res.json({
      success: true,
      message: "history cleared"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }
}


module.exports = {
  getReviewStats,
  getReviewHistory,
  clearReviewHistory
};