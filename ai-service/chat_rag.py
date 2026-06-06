from rag.rag_service import get_rag_content
from rag.llm_service import answer_with_rag

print("\n=== CodeSensei RAG Chat ===")
print("Type 'exit' to quit\n")

while True:
    query = input("Ask a question:")
    
    if query.lower() == "exit":
        break
    
    try:
        
        rag_result = get_rag_content(
            query
        )
        
        answer = answer_with_rag(
            query,
            rag_result["context"]
        )
        
        print("\nSource:" , rag_result["source"])
        
        if(rag_result["source"] == "local"):
            print(
                "Documents:"
            )
            
            for doc in rag_result["documents"]:
                print(
                    f"-{doc}"
                )
        print("\nAnswer:")
        print(answer)
        print("\n" + "="*50 + "\n")

    except Exception as e:
        
        print(
            "\nError:",
            str(e)
        )