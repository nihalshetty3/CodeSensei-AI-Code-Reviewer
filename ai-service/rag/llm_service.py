from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)

def answer_with_rag(
    query,
    context,
    history=None
):

    if history is None:
        history = []

    messages = [
        {
            "role": "system",
            "content": """
You are CodeSensei AI Assistant.

Use the provided context to answer questions.

If the context does not contain the answer,
answer using your general knowledge.

Use previous conversation history when answering.

If the user asks follow-up questions using words like:
he, she, it, they, its, them, that, those

resolve them using the conversation history.

Keep answers concise and developer-friendly.
"""
        }
    ]

    # Add previous chat history
    for msg in history:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    # Add current query
    messages.append({
        "role": "user",
        "content": f"""
Context:
{context}

Current Question:
{query}

Answer using the context and conversation history.
"""
    })

    # Debug (optional)
    print("\n=== Messages Sent To LLM ===")
    for msg in messages:
        print(msg)
    print("============================\n")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.2
    )

    return (
        response
        .choices[0]
        .message
        .content
    )