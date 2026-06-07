const pool=require("../config/db");

const getReviewHistory=async(req, res)=>{
        try{
            const result=await pool.query(`
                 SELECT * FROM review_history ORDER BY review_date DESC
                `);

                res.status(200).json(result.rows);
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

const createReview = async (req, res) => {
  try {
    const {
      repository_name,
      pr_number,
      bugs_found,
      security_issues,
      review_summary,
      full_review
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO review_history (
        repository_name,
        pr_number,
        bugs_found,
        security_issues,
        review_summary,
        full_review
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        repository_name,
        pr_number,
        bugs_found,
        security_issues,
        review_summary,
        JSON.stringify(full_review)
      ]
    );

    res.status(201).json({
      success: true,
      review: result.rows[0]
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create review"
    });
  }
};

module.exports = {
  getReviewHistory,
  getReviewById,
  createReview,
};