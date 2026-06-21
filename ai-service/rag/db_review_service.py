import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_review_context():
    
    conn = psycopg2.connect(
        host="localhost",
        database="codesensei",
        user="postgres",
        password="2580",
        port="5432"
    )
    
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT
        repository_name,
        review_summary,
        full_review,
        review_date
    FROM review_history
    ORDER BY review_date DESC
    LIMIT 20
""")
    
    rows = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    context=""
    
    for row in rows:
        context+= f"""
Repository: {row[0]}
Summary: {row[1]}
# Review: {row[2]}
Date: {row[3]}

"""
    return context
