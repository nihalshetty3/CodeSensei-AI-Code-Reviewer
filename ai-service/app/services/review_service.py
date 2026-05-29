from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def cleaned_review(review):
    
    categories = [
        "bugs", 
        "security",
        "performance",
        "code_quality"
    ]
    
    cleaned= {}
    
    for category in categories:
        
        cleaned[category] = []
        
        seen_issues = set()
        
        issues = review.get(category , [])
        
        for issue in issues:
            
            issue_text = issue.get("issue" , "").strip()
            
            explanation =( 
            issue.get("explaination" , "")
            or issue.get("explanation")
            or ""
            ).strip()
            
            fix = issue.get("fix" , "").strip()
            
            severity = issue.get("severity" , "low").lower()
            
            line = issue.get("line" , 0)
            
            #skip if issues are empty
            
            if not issue_text:
                continue
            
            # remove duplicates
            if issue_text in seen_issues:
                continue
            
            seen_issues.add(issue_text)
            
            if severity not in [
                "low",
                "medium",
                "high",
                "critical"
            ]:
                severity = "low"
                
            cleaned[category].append({
                "line": line,
                "severity": severity,
                "issue": issue_text,
                "explanation": explanation,
                "fix": fix
            })
    
    return cleaned



def generate_review(code, language):

    prompt = f"""
You are an expert senior software engineer and static code analyzer.

Analyze the following {language} code carefully.

Detect:
- bugs
- runtime errors
- undefined variables
- logical issues
- syntax problems
- security vulnerabilities
- performance problems
- code quality issues

IMPORTANT:
- Analyze code line-by-line carefully.
- Only report issues directly observable in the code.
- Do not generate hypothetical issues.
- Do not invent variable values, array indices, or behaviors.
- Detect undefined variables and naming mismatches.
- Avoid duplicate issues.
- ONLY use these categories:
  bugs
  security
  performance
  code_quality
- Do not create additional categories.
- Every issue must include:
  - line
  - severity
  - issue
  - explanation
  - fix
- If no issues exist for a category, return [].
- Return ONLY valid JSON.

Return JSON in this format:

{{
  "bugs": [
    {{
      "line": 0,
      "severity": "high",
      "issue": "",
      "explanation": "",
      "fix": ""
    }}
  ],
  "security": [],
  "performance": [],
  "code_quality": []
}}

Code:
{code}
"""

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a code review AI that only returns valid JSON"
            },
            {
                "role":"user",
                "content":prompt
            }
        ],
        model="llama-3.1-8b-instant",
        
        response_format={
            "type":"json_object"
        }
    )

    response_text = chat_completion.choices[0].message.content
    print(response_text)
      
    review_json = json.loads(response_text)
    cleaned= cleaned_review(review_json)

    return cleaned