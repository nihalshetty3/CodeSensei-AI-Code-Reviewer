import os

def parse_file(file_name , content):
    
    extension = os.path.splitext(file_name)[1]
    
    language_map = {
        ".py": "python",
        ".js" : "javascript",
        ".java" : "java",
        ".cpp": "cpp",
        ".c" : "c",
        ".ts" : "typescript"
    }
    
    language = language_map.get(extension , "unknown")
    
    code = content.decode("utf-8")
    
    return {
        "language": language,
        "code" : code
    }