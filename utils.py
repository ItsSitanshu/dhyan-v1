import fitz  # PyMuPDF
import chromadb
import pytesseract
from pdf2image import convert_from_path
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(path="./db")
collection = chroma_client.get_or_create_collection(name="tutoring_knowledge")

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
def add_to_knowledge_base(documents):
    for i, doc in enumerate(documents):
        collection.add(
            ids=[str(i)],  
            documents=[doc],
            embeddings=[embed_text(doc)]
        )

def retrieve_relevant_docs(query, top_k=3):
    query_embedding = embed_text(query)
    results = collection.query(query_embedding, n_results=top_k)
    return results['documents'] if 'documents' in results else []

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text_sections = []
    
    for page in doc:
        text = page.get_text("text")
        if text.strip(): 
            text_sections.append(text.strip())
        else:  
            image = convert_from_path(pdf_path, first_page=page.number + 1, last_page=page.number + 1)[0]
            ocr_text = pytesseract.image_to_string(image)
            text_sections.append(ocr_text.strip())

    return text_sections

def add_pdf_to_knowledge_base(pdf_path):
    sections = extract_text_from_pdf(pdf_path)
    add_to_knowledge_base(sections)
    print(f"Added {len(sections)} sections from {pdf_path} to the knowledge base.")


def embed_text(text):
    return embedding_model.encode(text).tolist()

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text_sections = []
    
    for page in doc:
        text = page.get_text("text")
        if text.strip():
            text_sections.append(text.strip())
        else:  # Use OCR if no text is found
            pix = page.get_pixmap()
            ocr_text = pytesseract.image_to_string(img)
            text_sections.append(ocr_text.strip())
    
    return text_sections

def validate_filenames(supabase, filenames):
    response = supabase.table("documents").select("filename").in_("filename", filenames).execute()
    valid_files = {row["filename"] for row in response.data} if response.data else set()
    return valid_files
