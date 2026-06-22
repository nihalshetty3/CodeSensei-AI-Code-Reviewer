chat_sessions={}

def get_history(session_id):
    return chat_sessions.get(session_id, [])

def save_message(session_id , role , content):
    
    if session_id not in chat_sessions:
        chat_sessions[session_id]=[]
        
    chat_sessions[session_id].append({
        "role": role,
        "content": content
    })
    
    #last 20 messages only
    chat_sessions[session_id] = (
        chat_sessions[session_id][-20:]
    )