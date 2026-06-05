from sentence_transformers import SentenceTransformer
import faiss
import pickle

model=SentenceTransformer(
    "all-MiniLM-L6-v2"
)

index = faiss.read_index(
    "rag/vector.index"
)

with open(
    "rag/documents.pkl",
    "rb"
) as f:
    
    documents = pickle.load(f)
    
def retrieve_context(query):
    
    embedding = model.encode(
        [query]
    )
    
    distances , indices = index.search(
        embedding,
        1
    )
    
    results=[]
    
    for idx in indices[0]:
        results.append(
            documents[idx]
        )
    
    return {
        "documents": results,
        "distance": float(
            distances[0][0]
        )
    }
    
    