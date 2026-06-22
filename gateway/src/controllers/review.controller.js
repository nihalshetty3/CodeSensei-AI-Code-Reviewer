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

const prisma = require("../config/prisma");



const repositoryReview = async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE}/repository-review`,
      req.body
    );

    const reviewData = response.data;

    
    const githubId = req.user.githubid;

      console.log("==============");
console.log("REQ USER");
console.log(req.user);
console.log("USER ID:", req.user.userID);
console.log("==============");




  
      const userId = req.user.userID;

      console.log("userId type:", typeof userID);
    const bugsFound =
  reviewData.summary?.total_bugs || 0;

const securityIssues =
  reviewData.summary?.security_issues || 0;

const performanceIssues =
  reviewData.summary?.performance_issues || 0;

const codeQualityIssues =
  reviewData.files?.reduce(
    (count, file) =>
      count + (file.review?.code_quality?.length || 0),
    0
  ) || 0;


      const reviewSummary =
      `Bugs: ${bugsFound}, Security: ${securityIssues}, ` +
      `Performance: ${performanceIssues}, Code Quality: ${codeQualityIssues}`;
      console.log("INSERT VALUES:");
console.log([
  userId,
  req.body.repo_url || "Repository Review",
  null,
  "repository",
  bugsFound,
  securityIssues,
  performanceIssues,
  codeQualityIssues,
  reviewSummary,
  JSON.stringify(reviewData)
]);


   await prisma.reviewHistory.create({
  data: {
    user_id: userId,
    repository_name: req.body.repo_url || "Repository Review",
    pr_number: null,
    review_type: "repository",

    bugs_found: bugsFound,
    security_issues: securityIssues,
    performance_issues: performanceIssues,
    code_quality_issues: codeQualityIssues,

    review_summary: reviewSummary,

    full_review: reviewData
  }
});
    

    res.json(reviewData);
  }
   catch (err) {
    res
      .status(aiServiceErrorStatus(err))
      .json(aiServiceErrorBody(err));
  }
}


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
