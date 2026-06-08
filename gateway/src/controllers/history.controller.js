const pool=require("../config/db");

const getStats=async(req,res)=>{
       try{
           const githubId=req.user.githubId;
           const userResult=await pool.query("SELECT id from users WHERE github_id =$1",[githubId]);

           if(userResult.rows.length === 0){
                return res.json({
        totalReviews: 0,
        totalBugs: 0,
        totalSecurity: 0,
      });
             
        }

        const userId=userResult.rows[0].id;
      
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
          const githubId=req.user.githubId;
          
          const userResult=await pool.query(
              "SELECT id FROM users WHERE github_id = $1",
      [githubId] 
          );

          const userId=userResult.rows[0].id;
 const history = await pool.query(
      `
      SELECT *
      FROM review_history
      WHERE user_id = $1
      ORDER BY review_date DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      reviews: history.rows,
    });


           
        }catch(err){
                 console.error("History Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch review history",
    });
        }
}


const getReviewById=async(req,res)=>{
         try{
            const{id}=req.params;

             const result=await pool.query(`
                    SELECT * FROM review_history 
                    where id=$1
                `,[id]);

                if(result.rows.length === 0){
                        return res.status(404).json({
        success: false,
        message: "Review not found",
      });
                }

               res.status(200).json(result.rows[0]);
         }catch(error){
               console.error("Review Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch review",
    });
                 
         }
};


module.exports = {
  getStats,
  getReviewHistory,
  getReviewById
};