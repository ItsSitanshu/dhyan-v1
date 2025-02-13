import os
import time
import json
import fitz  # PyMuPDF
import pytesseract
import chromadb

import google.generativeai as genai

import random
from flask_cors import CORS
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from utils import *
from supabase import create_client, Client
from PIL import Image
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(path="./db")
collection = chroma_client.get_or_create_collection(name="knowledge_base")

app = Flask(__name__)
CORS(app)

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
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            ocr_text = pytesseract.image_to_string(img)
            text_sections.append(ocr_text.strip())
    
    return text_sections

def validate_filenames(filenames):
    response = supabase.table("documents").select("filename").in_("filename", filenames).execute()
    valid_files = {row["filename"] for row in response.data} if response.data else set()
    return valid_files

@app.route("/add_pdf", methods=["POST"])
def add_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    filename = file.filename
    
    # Validate filename with Supabase
    if filename not in validate_filenames([filename]):
        return jsonify({"error": "File not found in Supabase"}), 400
    
    file_path = os.path.join("./uploads", filename)
    file.save(file_path)
    
    sections = extract_text_from_pdf(file_path)
    for i, section in enumerate(sections):
        collection.add(ids=[f"{filename}_{i}"], documents=[section], embeddings=[embed_text(section)])
    
    return jsonify({"message": f"Added {len(sections)} sections from {filename} to the knowledge base."})

@app.route("/retrieve", methods=["POST"])
def retrieve():
    data = request.json
    query = data.get("query")
    top_k = data.get("top_k", 3)
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    query_embedding = embed_text(query)
    results = collection.query(query_embedding, n_results=top_k)
    
    return jsonify({"documents": results.get("documents", [])})

API_KEYS = [
    os.getenv("API_KEY1"),
    os.getenv("API_KEY2"),
    os.getenv("API_KEY3"),
]


random.shuffle(API_KEYS)

api_index = 0

def get_next_api_key():
    global api_index
    api_key = API_KEYS[api_index]
    api_index = (api_index + 1) % len(API_KEYS)
    return api_key

def load_prompts():
    with open("prompts.json", "r") as file:
        return json.load(file)

prompts = load_prompts()
print(prompts.keys())

genai.configure(api_key=get_next_api_key())
model = genai.GenerativeModel('gemini-1.5-flash-8b')


@app.route("/api/title", methods=["POST"])
def title():
    global model
    history = request.json.get("history")
    
    start = time.time()

    if not history:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "response": "No query provided",
            "time": time.time() - start,
        })
        
    api_key = get_next_api_key()
    print("CURRENT API = " + api_key)
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash-8b')

    full_prompt = prompts["title_prompt"].format(history=history)

    raw_response = model.generate_content(full_prompt)
        
    return jsonify({
        "code": HTTP_OK,
        "response": raw_response.text,
        "time": time.time() - start,
    })


@app.route("/api/tutor", methods=["POST"])
def tutor():
    global model
    user_input = request.json.get("query")
    details = request.json.get("details")
    history = request.json.get("history", "")
    feedback_metrics = request.json.get("feedback_metrics", {})

    start = time.time()

    if not user_input:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "response": "No query provided",
            "time": time.time() - start,
        })
    
    api_key = get_next_api_key()
    print("CURRENT API = " + api_key)
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash-8b')
    
    relevant_docs = retrieve_relevant_docs(user_input, top_k=3)
    retrieved_knowledge = "\n".join(relevant_docs[0])
    
    full_prompt = prompts["tutor_prompt"].format(history=history, relevant_knowledge=retrieved_knowledge, user_input=user_input)
    
    raw_response = model.generate_content(full_prompt)
    
    special_action_prompt = prompts["special_prompt"].format(history=history, user_input=user_input)
    special_action = model.generate_content(special_action_prompt)
    
    return jsonify({
        "code": HTTP_OK,
        "response": raw_response.text,
        "special_action": special_action.text,
        "time": time.time() - start,
    })

@app.route("/api/feedback", methods=["POST"])
def feedback():
    data = request.json
    model_extraction = data.get("model_extraction", {})
    stars = data.get("stars", 0)

    feedback_metrics = {
        "knowledge_level": model_extraction.get("knowledge_level", 0),
        "learning_progress": model_extraction.get("learning_progress", 0),
        "engagement": model_extraction.get("engagement", 0),
        "response_time": model_extraction.get("response_time", 0),
        "fatigue": model_extraction.get("fatigue", 0),
        "confidence": (stars + model_extraction.get("knowledge_level", 0) + model_extraction.get("learning_progress", 0) + model_extraction.get("engagement", 0)) / 4
    }

    return jsonify({
        "code": HTTP_OK,
        "feedback_metrics": feedback_metrics
    })

@app.route("/api/extract", methods=["POST"])
def extract():
    data = request.json
    prev_response = data.get("prev_response", "")
    
    if not prev_response:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "message": "No previous response provided"
        })
    
    api_key = get_next_api_key()
    genai.configure(api_key=api_key)
    extraction_model = genai.GenerativeModel('gemini-1.5-flash-8b')
    
    extraction_prompt = prompts["extraction_prompt"].format(prev_response=prev_response)
    extraction_result = extraction_model.generate_content(extraction_prompt)
    
    return jsonify({
        "code": HTTP_OK,
        "extracted_info": extraction_result.text
    })

if __name__ == "__main__":
    app.run(debug=True)
