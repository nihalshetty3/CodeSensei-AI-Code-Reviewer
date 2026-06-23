import requests

OLLAMA_URL= "http://localhost:11434/api/generate"

def answer_with_ollama(messages):
    
    prompt=""
    
    for msg in messages:
        prompt+= (
            f"{msg['role']}:\n"
             f"{msg['content']}\n\n"
        )
        
    response = requests.post(
            OLLAMA_URL,
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False
            },
            timeout=120
    )
        
    response.raise_for_status()
        
    return response.json()["response"]