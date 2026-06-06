const {Octokit} = require("@octokit/rest");
const { get } = require("../routes/githubAuth.routes");

const getRepositories = async (req , res) =>{
    try{
        const octokit = new Octokit({
            auth: req.user.accessToken
        });

        const response = await octokit.repos.listForAuthenticatedUser();

        const repos = response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            private: repo.private,
            url : repo.html_url
        }));

        res.json({
            success: true,
            repositories: repos
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getRepositories
};