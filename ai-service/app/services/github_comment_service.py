import os 
print(
    "TOKEN:",
    os.getenv("GITHUB_TOKEN")
)
from github import Github

github_client = Github(
    os.getenv("GITHUB_TOKEN")
)

def post_pr_comment(
    owner,
    repo, 
    pr_numer,
    comment
):
    
    repository = github_client.get_repo(
        f"{owner}/{repo}"
    )
    
    pull_request = repository.get_pull(
        pr_numer
    )
    
    pull_request.create_issue_comment(
        comment
    )