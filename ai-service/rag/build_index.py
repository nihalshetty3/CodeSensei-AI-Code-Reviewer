from sentence_transformers import SentenceTransformer
import faiss
import os
import pickle

#Embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

docs=[]
file_names=[]

docs_path="rag/docs"

for file in os.listdir(docs_path):
    
    with open(
        os.path.join(
            docs_path,
            file
        ),
        "r"
    ) as f:
        
        docs.append(
            f.read()
        )
        
        file_names.append(
            file
        )
embeddings = model.encode(
    docs
)

index = faiss.IndexFlatL2(
    embeddings.shape[1]
)

index.add(
    embeddings
)

faiss.write_index(
    index,
    "rag/vector.index"
)

with open(
    "rag/documents.pkl",
    "wb"
) as f:
    
    pickle.dump(
        docs,
        f
    )
    
print(
    "RAG Index Built"
)