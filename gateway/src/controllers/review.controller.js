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
const repositoryReview = proxyJsonToAi("/repository-review");

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
