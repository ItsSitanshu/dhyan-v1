import os
import time
import google.generativeai as genai


from flask import Flask, request, jsonify
from dotenv import load_dotenv


app = Flask(__name__)

load_dotenv()
API_KEY = os.getenv("API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-pro')

pre_prompt = "Answer this question as a tutor:"

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("query")
    if not user_input:
      return jsonify({"error": "No query provided"}), 400
    
    start = time.time()
    raw_response = model.generate_content(pre_prompt + user_input)
    end = time.time()

    response = raw_response.text

    return jsonify({"response": response, "time": end - start})

if __name__ == "__main__":
    app.run(debug=True)
