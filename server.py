import os
import time
import json
import chromadb
import random

import google.generativeai as genai

from flask_cors import CORS
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from utils import *
from prompts import *
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer

START = time.time()

load_dotenv()

print(f"LOADED .ENV @ {time.time() - START}")

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

print(f"LOADED SUPABASE CLIENT @ {time.time() - START}")

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

print(f"LOADED SentenceTransformer(all-MiniLM-L6-v2) @ {time.time() - START}")

chroma_client = chromadb.PersistentClient(path="./rag")
collection = chroma_client.get_or_create_collection(name="books")


print(f"SETUP ChromaDB @ {time.time() - START}")

app = Flask(__name__)
CORS(app)

API_KEYS = [
    os.getenv("API_KEY1"),
    os.getenv("API_KEY2"),
    os.getenv("API_KEY3"),
    os.getenv("API_KEY4"),
    os.getenv("API_KEY5"),
    os.getenv("API_KEY6"),
    os.getenv("API_KEY7"),
    os.getenv("API_KEY8"),
    os.getenv("API_KEY9"),
    os.getenv("API_KEY10"),
    os.getenv("API_KEY11"),
    os.getenv("API_KEY12")
]

def get_valid_response(prompt):
    for api_key in API_KEYS:
        try:
            print("Trying API Key: " + api_key)
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash-8b')
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text
        except Exception as e:
            print(f"API Key {api_key} failed: {e}")
        finally:
            random.shuffle(API_KEYS)
    return None


@app.route("/api/title", methods=["POST"])
def title():
    history = request.json.get("history")
    start = time.time()

    if not history:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "response": "No query provided",
            "time": time.time() - start,
        })
    
    full_prompt = prompts["title_prompt"].format(history=history)
    response_text = get_valid_response(full_prompt)
    
    if response_text:
        return jsonify({
            "code": HTTP_OK,
            "response": response_text,
            "time": time.time() - start,
        })
    else:
        return jsonify({"code": HTTP_BAD_REQUEST, "response": "API request failed"})


@app.route("/api/tutor", methods=["POST"])
def tutor():
    details = request.json.get("details")
    user_input = request.json.get("query")
    history = request.json.get("history")
    files = request.json.get("files")

    start = time.time()

    if not user_input:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "response": "No query provided",
            "time": time.time() - start,
        })

    print(details)

    relevant_docs = retrieve_most_relevant_chunk(collection, user_input, files)
    retrieved_knowledge = "\n".join(relevant_docs)
    full_prompt = prompts["tutor_prompt"].format(
        name=details["name"],
        grade=details["grade"],
        learningStyle=details["learningStyle"],
        history=history,
        relevant_knowledge=retrieved_knowledge,
        user_input=user_input
    )
    
    response_text = get_valid_response(full_prompt)
    special_prompt = prompts["special_prompt"].format(history=history, user_input=user_input)
    special_action_text = get_valid_response(special_prompt)
    
    return jsonify({
        "code": HTTP_OK,
        "response": response_text if response_text else "API request failed",
        "special_action": special_action_text if special_action_text else "No special action available",
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
    
    extraction_prompt = prompts["extraction_prompt"].format(prev_response=prev_response)
    extracted_text = get_valid_response(extraction_prompt)
    
    return jsonify({
        "code": HTTP_OK,
        "extracted_info": extracted_text if extracted_text else "Extraction failed"
    })

@app.route("/api/vectorize", methods=["POST"])
def vectorize():
    data = request.json
    filename = data.get("filename")
    
    if not filename:
        return jsonify({"error": "Filename required"}), HTTP_BAD_REQUEST
    
    response = supabase.storage.from_("books").list()
    files = {file["name"] for file in response}

    if filename not in files:
        return jsonify({"error": "File not found in storage"}), HTTP_NOT_FOUND

    if is_vectorized(collection, filename):
        return jsonify({"message": "Already vectorized"}), HTTP_OK

    pdf_data = supabase.storage.from_("books").download(filename)
    with open(f"/tmp/{filename}", "wb") as f:
        f.write(pdf_data)

    sections = extract_text_from_pdf(f"/tmp/{filename}")
    vectorize_and_store(collection, filename, sections)
    
    return jsonify({"message": f"Vectorized {filename} successfully", "sections": len(sections)}), HTTP_OK

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
