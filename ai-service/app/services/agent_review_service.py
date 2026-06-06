from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)



def bug_review(code , language):
    
    prompt = f"""
You are a senior software engineer.
    
Only identify:
- logic bugs
- runtime errors
- syntax issues
- null pointer issues
- edge cases

DO NOT report:
- security issues
- performance issues
- code quality issues

Return JSON:

{{
  "bugs":[]
}}

Code:
{code}
"""
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Return valid JSON only"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.1-8b-instant",
        response_format={
            "type":"json_object"
        }
    )
    
    return json.loads(
        response.choices[0].message.content
    )
    
    
def security_review(
    code,
    language
):
    
    prompt=f"""
You are an OWASP security auditor.

Only identify:

- SQL Injection
- XSS
- Secrets
- Authentication issues
- Authorization issues
- Unsafe deserialization

DO NOT report:
- bugs
- performance
- code quality

Return JSON:

{{
  "security":[]
}}

Code:
{code}
"""
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Return valid JSON only"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.1-8b-instant",
        response_format={
            "type":"json_object"
        }
    )
    
    return json.loads(
        response.choices[0].message.content
    )
    
    
def performance_review(
    code,
    language
):
    
    prompt = f"""
You are a performance engineer.

Only identify:

- nested loops
- memory issues
- repeated calculations
- expensive API calls
- inefficient algorithms

DO NOT report:
- bugs
- security
- code quality

Return JSON:

{{
  "performance":[]
}}

Code:
{code}
"""
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Return valid JSON only"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.1-8b-instant",
        response_format={
            "type":"json_object"
        }
    )
    
    return json.loads(
        response.choices[0].message.content
    )