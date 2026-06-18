const pool=require("../config/db");

const getReviewStats=async(req,res)=>{
       try{
            const userId = req.user.userID;
      
    const stats = await pool.query(
      `
      SELECT
      COUNT(*) AS total_reviews,
      COALESCE(SUM(bugs_found),0) AS total_bugs,
      COALESCE(SUM(security_issues),0) AS total_security
      FROM review_history
      WHERE user_id = $1
      `,
      [userId]
    );

    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const getReviewHistory=async(req, res)=>{
        try{
          const userId=req.user.userID;
          
        
          
 const history = await pool.query(
      `
      SELECT   id,
          repository_name,
          pr_number,
          review_date,
          bugs_found,
          security_issues,
          performance_issues,
          code_quality_issues,
          review_summary,
          full_review
      FROM review_history
      WHERE user_id = $1
      ORDER BY review_date DESC
      `,
      [userId]
    );

    res.status(200).json(history.rows);

           
        }catch(err){
                 console.error("History Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch review history",
    });
        }
}

const clearReviewHistory=async(req,res)=>{
      try{
          const userId=req.user.userID;
          await pool.query(
            `DELETE FROM review_history
            WHERE user_id=$1`,[userId]
          );

          res.json({
            success:true,
            message:"history cleared"
          });

      }catch(error){
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