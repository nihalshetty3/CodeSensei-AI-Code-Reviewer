import os 

SUPPORTED_EXTENSIONS = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".go": "go"
}

def detect_language(filename):
    ext = os.path.splitext(filename)[1]
    
    return SUPPORTED_EXTENSIONS.get(
        ext ,
        "text"
    )