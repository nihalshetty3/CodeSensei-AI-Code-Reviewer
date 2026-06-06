from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()


client = Groq(
    api_key = os.getenv(
        "GROQ_API_KEY"
    )
)

def answer_with_rag(
    query,
    context
):
    
    prompt = f"""
Question:
{query}

Context:
{context}

Answer the question using the context.

keep answer concise.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ]
    )
    
    return (
        response
        .choices[0]
        .message
        .content
    )