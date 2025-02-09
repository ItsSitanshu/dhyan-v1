import os
import time
import json
import google.generativeai as genai

import random
from flask_cors import CORS
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from utils import *

load_dotenv()

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
    os.getenv("API_KEY12"),
    os.getenv("API_KEY13"),
    os.getenv("API_KEY14"),
    os.getenv("API_KEY15")
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

@app.route("/api/tutor", methods=["POST"])
def tutor():
    global model
    user_input = request.json.get("query")
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
    print("CURRENT API KEY =", api_key)
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
