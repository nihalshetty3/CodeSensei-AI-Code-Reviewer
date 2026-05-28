from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_review(code, language):

    prompt = f"""
You are a senior software engineer.

Analyze the following {language} code.

Return ONLY valid JSON.

JSON format:

{{
  "bugs": [
    {{
      "issue": "",
      "explanation": "",
      "fix": ""
    }}
  ],
  "security": [
    {{
      "issue": "",
      "explanation": "",
      "fix": ""
    }}
  ],
  "performance": [
    {{
      "issue": "",
      "explanation": "",
      "fix": ""
    }}
  ],
  "code_quality": [
    {{
      "issue": "",
      "explanation": "",
      "fix": ""
    }}
  ]
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

    return json.loads(response_text)