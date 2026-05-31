import os 
from github import Github
from app.utils.pr_parser import parse_pr_url

github_client = Github(
    os.getenv("GITHUB_TOKEN")   
)

def get_pr_files(pr_url):
    
    owner , repo , pr_number = parse_pr_url(
        pr_url
    )
    
    repository = github_client.get_repo(
        f"{owner}/{repo}"
    )
    
    pull_request = repository.get_pull(
        pr_number
    )
    
    files = []
    
    for file in pull_request.get_files():
        
        if not file.patch:
            continue
        
        ext = os.path.splitext(file.filename)[1]
        
        if ext not in SUPPORTED_EXTENSIONS:
            continue
        
        files.append({
            "filename": file.filename,
            "patch": file.patch
        })
        
    return files