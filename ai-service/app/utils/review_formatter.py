def format_review_comment(
    reviewed_files,
    summary
):
    
    comment = "# CodeSensei Review\n\n"
    comment+=f"Files Reviewed: {len(reviewed_files)}\n"
    comment+=f"bugs: {summary['total_bugs']}\n"
    comment+=f"Security: {summary['security_issues']}\n"
    comment+= f"Performance: {summary['performance_issues']}\n\n"
    
    comment+= "## Top finding\n\n"
    
    for file in reviewed_files:
        comment+=f"### {file['filename']}\n"
        
        bugs = file["review"].get("bugs" , [])
        
        for bug in bugs[:2]:
            
            comment += (
                f"- {bug['issue']}\n"
            )
            
        security = file["review"].get(
            "security",
            []
        )
        
        for item in security[:2]:
            comment += (
                f" {item['issue']}\n"
            )
            
        performance = file["review"].get(
            "performance",
            []
        )
        
        for item in performance[:2]:
            comment += (
                f"- {item['issue']}\n"
            )
        comment+= "\n"
        
    return comment