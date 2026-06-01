from fastapi import APIRouter
from fastapi import Request

from app.services.github_service import (
    get_pr_files
)

from app.services.review_service import (
    generate_review,
    generate_repositoryy_summary
)

from app.services.github_comment_service import (
    post_pr_comment
)

from app.utils.review_formatter import (
    format_review_comment
)

from app.utils.pr_parser import (
    parse_pr_url
)

from app.utils.language_detector import (
    detect_language
)

router = APIRouter()

@router.post("/github/webhook")
async def github_webhook(
    request: Request
):

    payload = await request.json()

    action = payload.get("action")

    if action != "opened":
        return {
            "message": "Ignoring event"
        }

    pr_url = payload["pull_request"]["html_url"]

    owner, repo, pr_number = parse_pr_url(
        pr_url
    )

    pr_files = get_pr_files(
        pr_url
    )

    reviewed_files = []

    for file in pr_files:

        language = detect_language(
            file["filename"]
        )

        review = generate_review(
            file["patch"],
            language
        )

        reviewed_files.append({
            "filename": file["filename"],
            "language": language,
            "review": review
        })

    summary = generate_repositoryy_summary(
        reviewed_files
    )

    comment = format_review_comment(
        reviewed_files,
        summary
    )

    post_pr_comment(
        owner,
        repo,
        pr_number,
        comment
    )

    return {
        "success": True
    }