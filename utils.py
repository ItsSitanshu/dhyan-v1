import fitz  # PyMuPDF
import chromadb
import pytesseract
from pdf2image import convert_from_path
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

HTTP_OK = 200
HTTP_CREATED = 201
HTTP_ACCEPTED = 202
HTTP_NO_CONTENT = 204

HTTP_BAD_REQUEST = 400
HTTP_UNAUTHORIZED = 401
HTTP_FORBIDDEN = 403
HTTP_NOT_FOUND = 404
HTTP_METHOD_NOT_ALLOWED = 405
HTTP_CONFLICT = 409
HTTP_UNSUPPORTED_MEDIA_TYPE = 415
HTTP_TOO_MANY_REQUESTS = 429

HTTP_INTERNAL_SERVER_ERROR = 500
HTTP_NOT_IMPLEMENTED = 501
HTTP_BAD_GATEWAY = 502
HTTP_SERVICE_UNAVAILABLE = 503
HTTP_GATEWAY_TIMEOUT = 504

def embed_text(text):
    return embedding_model.encode(text).tolist()

def is_vectorized(collection, filename):
    results = collection.query(
        query_embeddings=[[0] * 384],  
        where={"filename": filename}, 
        n_results=3
    )
    
    results_actual = results["ids"][0]

    print(len(results_actual))

    return len(results_actual) > 0

def retrieve_most_relevant_chunk(collection, query, priority_files=None, top_k=5, min_score=0.5):
    query_embedding = embed_text(query)

    print("PF", priority_files)

    if priority_files:
        results = collection.query(
            query_embeddings=[query_embedding],
            where={"filename": {"$in": priority_files}},  
            n_results=top_k
        )

        if not results.get("matches"):
            results = collection.query(query_embeddings=[query_embedding], n_results=top_k)
    else:
        results = collection.query(query_embeddings=[query_embedding], n_results=top_k)

    matches = results.get("matches", [])
    filtered_matches = [m for m in matches if m.get("score", 0) >= min_score]

    filtered_matches.sort(key=lambda x: x.get("score", 0), reverse=True)

    if filtered_matches:
        return filtered_matches[0].get("document", "")

    return ""




def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text_sections = []

    for page in doc:
        text = page.get_text("text")
        if text.strip():
            text_sections.append(text.strip())

    return text_sections

def vectorize_and_store(collection, filename, text_sections):
    embeddings = [embed_text(section) for section in text_sections]
    
    for i, section in enumerate(text_sections):
        collection.add(
            ids=[f"{filename}_{i}"],
            documents=[section],
            embeddings=[embeddings[i]],
            metadatas=[{"filename": filename}]
        )
    