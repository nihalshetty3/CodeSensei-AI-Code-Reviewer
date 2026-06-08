const axios = require("axios");
const FormData = require("form-data");

const AI_SERVICE = process.env.AI_SERVICE_URL || "http://127.0.0.1:8001";

const proxyJsonToAi = (path) => async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE}${path}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(aiServiceErrorStatus(err)).json(aiServiceErrorBody(err));
  }
};

function aiServiceErrorStatus(err) {
  if (!err.response && (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND")) {
    return 503;
  }
  return err.response?.status || 500;
}

function aiServiceErrorBody(err) {
  if (!err.response && (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND")) {
    return {
      detail:
        "AI service is not running. Restart with: npm run dev (uvicorn should be on http://127.0.0.1:8001)",
    };
  }
  return (
    err.response?.data || {
      detail: err.message || "Error communicating with AI service",
    }
  );
}

const reviewCode = proxyJsonToAi("/review");
const prReview = proxyJsonToAi("/pr-review");

const pool = require("../config/db");


const repositoryReview = async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE}/repository-review`,
      req.body
    );

    const reviewData = response.data;

    // github id comes from JWT
    const githubId = req.user.githubid;

    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE github_id = $1
      `,
      [githubId]
    );

    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;

      await pool.query(
        `
        INSERT INTO review_history
        (
          user_id,
          repository_name,
          review_type,
          bugs_found,
          security_issues,
          performance_issues,
          code_quality_issues,
          full_review
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
        `,
        [
          userId,
          reviewData.repository,
          "repository",
          reviewData.summary?.total_bugs || 0,
          reviewData.summary?.security_issues || 0,
          reviewData.summary?.performance_issues || 0,
          reviewData.summary?.code_quality_issues || 0,
          JSON.stringify(reviewData),
        ]
      );
    }

    res.json(reviewData);
  } catch (err) {
    res
      .status(aiServiceErrorStatus(err))
      .json(aiServiceErrorBody(err));
  }
};

const uploadReview = async (req, res) => {
  try {
    const form = new FormData();
    for (const file of req.files || []) {
      form.append("files", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    }

    const response = await axios.post(`${AI_SERVICE}/upload-review`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    res.json(response.data);
  } catch (err) {
    res.status(aiServiceErrorStatus(err)).json(aiServiceErrorBody(err));
  }
};

const uploadZipReview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No ZIP file uploaded." });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${AI_SERVICE}/upload-zip-review`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    res.json(response.data);
  } catch (err) {
    res.status(aiServiceErrorStatus(err)).json(aiServiceErrorBody(err));
  }
};

module.exports = {
  reviewCode,
  prReview,
  repositoryReview,
  uploadReview,
  uploadZipReview,
};
