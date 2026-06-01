import zipfile
import tempfile
import os

SUPPORTED_EXTENSIONS = {
    ".py": "python",
    ".js": "javascript",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c"
}

IGNORE_FOLDERS = {
    "node_modules",
    ".git",
    "__pycache__",
    ".venv",
    "venv"
}


def parse_zip(zip_path):

    parsed_files = []

    with tempfile.TemporaryDirectory() as temp_dir:

        # Extract zip
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)

        # Walk through extracted repository
        for root, dirs, files in os.walk(temp_dir):

            # Ignore unnecessary folders
            dirs[:] = [
                d for d in dirs
                if d not in IGNORE_FOLDERS
            ]

            for file in files:

                extension = os.path.splitext(file)[1]

                # Skip unsupported files
                if extension not in SUPPORTED_EXTENSIONS:
                    continue

                full_path = os.path.join(root, file)

                try:

                    with open(
                        full_path,
                        "r",
                        encoding="utf-8"
                    ) as f:

                        code = f.read()

                    parsed_files.append({
                        "filename": file,
                        "language": SUPPORTED_EXTENSIONS[extension],
                        "code": code
                    })

                except Exception as e:
                    print(f"Error reading {file}: {e}")
                    continue

    return parsed_files