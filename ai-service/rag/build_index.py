from sentence_transformers import SentenceTransformer
import faiss
import os
import pickle
import fitz

#Embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

docs=[]

docs_path="rag/docs"
CHUNK_SIZE= 1000

def extract_pdf_text(pdf_path):
    text=""
    
    pdf = fitz.open(pdf_path)
    
    for page in pdf:
        text += page.get_text()
        
    pdf.close()
    return text
    
    
def chunk_text(
    text,
    chunk_size = CHUNK_SIZE
):
    
    chunks=[]
    
    for i in range(
        0,
        len(text),
        chunk_size
    ):
        
        chunks.append(
            text[i:i + chunk_size]
        )
    return chunks


for file in os.listdir(docs_path):
    file_path = os.path.join(
        docs_path,
        file
    )
    
    try:
        
        if file.endswith(".txt"):
            
            with open(
                file_path,
                "r",
                encoding="utf-8"
            ) as f:
                
                text = f.read()
                
                chunks= chunk_text(
                    text
                )
                
                for chunk in chunks:
                    docs.append({
                        "source":file,
                        "content": chunk
                    })
                
        elif file.endswith(".pdf"):
            pdf_text = extract_pdf_text(
                file_path
            )
            
            chunks=chunk_text(
                pdf_text
            )
            
            for chunk in chunks:
                
                docs.append({
                    "source": file,
                    "content": chunk
                })
            
    
    except Exception as e:
        
        print(
            f"Error processing {file}: {e}"
        )
print(
    f"Loaded {len(docs)} chunks"
)

embedddings = model.encode(
    [
        doc["content"]
        for doc in docs
    ]
)

index = faiss.IndexFlatL2(
    embedddings.shape[1]
)

index.add(
    embedddings
)

faiss.write_index(
    index,
    "rag/vector.index"
)

with open(
    "rag/documents.pkl",
    "wb"
)as f:
    
    pickle.dump(
        docs,
        f
    )
    
print("RAG index built")