import os 
import tempfile
from git import Repo

SUPPORTED_EXTENSIONS = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".cs": "csharp",
    ".go": "go",
    ".rs": "rust",
    ".php": "php",
    ".rb": "ruby",
    ".swift": "swift",
    ".kt": "kotlin",
    ".scala": "scala",
    ".sh": "bash",
    ".sql": "sql",
    ".html": "html",
    ".css": "css"
}

MAX_FILES=15

def parse_repository(repo_url):
    temp_dir = tempfile.mkdtemp()
    
    Repo.clone_from(
        repo_url,
        temp_dir
    )
    
    parsed_files=[]
    
    for root , dirs , files in os.walk(temp_dir):
        
        dirs[:] = [
            d for d in dirs
            if d not in [
                 ".git",
                 "node_modules",
                "__pycache__",
                "venv",
                ".venv",
                "dist",
                "build",
                ".next"
            ]
        ]
        
        if any(
            folder in root.lower()
            for folder in [
                "tests",
                "test",
                "__test__",
                "example",
                "examples"
            ]
        ):
            continue
        
        for file in files:
            ext = os.path.splitext(file)[1]
            
            if ext not in SUPPORTED_EXTENSIONS:
                continue
            
            file_path = os.path.join(root , file)
            
            try:
                
                with open(
                    file_path,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:
                    
                    code = f.read()
                    
                if len(code) > 3000:
                    continue
                   
                    
                    
                parsed_files.append({
                    "filename": file,
                    "language": SUPPORTED_EXTENSIONS[ext],
                    "code": code
                })
                
                if len(parsed_files) >= MAX_FILES:
                    return parsed_files
                
            except Exception as e:
                print("Error", e)
    
    return parsed_files
