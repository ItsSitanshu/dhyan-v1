import os
import time
import google.generativeai as genai
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
]

api_index = 0

def get_next_api_key():
    global api_index
    api_key = API_KEYS[api_index]
    api_index = (api_index + 1) % len(API_KEYS)
    return api_key

genai.configure(api_key=get_next_api_key())
model = genai.GenerativeModel('gemini-1.5-flash-8b')

pre_prompt = """
You are a highly skilled tutor who excels at providing clear, comprehensive explanations tailored to the student’s 
needs. Your responses should integrate the following quantitative and qualitative feedback, provided by an RL 
model designed to optimize learning outcomes based on the student's academic performance, engagement, and recent
feedback. Keep the messages concice when required. Make sure to not overexplain. Overexplaining is discouraged unless specified
The student’s data is as follows:

Name: Sitanshu Shrestha

1. Learning Style:
  - The student prefers a step-by-step approach, which should be reflected in your explanations. 
  - The student engages best with examples that demonstrate the application of concepts in real-world contexts.
  - Learning preferences:
    - Numerical: Prefers detailed breakdowns of problems, with 80% success rate when examples are included.
    - Visual: Occasional visual examples are beneficial.

2. Current Performance:
  - Mathematics:
    - Current grade: 65% (struggling in advanced topics such as algebra and calculus).
    - Performance trend: Declining, with recent grades in algebra at 58% and calculus at 62%.
    - Immediate need: Simplify advanced concepts with 2-3 examples per concept.

  - Programming:
    - Current grade: 90% (performing excellently).
    - Performance trend: Steady, with a slight dip (from 92% to 90%) in the last assignment.
    - Immediate need: Review data structures and algorithm optimization to improve problem-solving in edge cases.

  - Data Science:
    - Current grade: 80% (good understanding but needs more practice with statistical models).
    - Immediate need: Reinforce concepts like linear regression and data cleaning with 2 additional examples.

3. Engagement:
  - Hints Requested: The student has requested 4 hints in the last 5 interactions, indicating difficulty with certain topics or a need for additional clarification.
  - Abrupt Exits: The student has exited 2 sessions abruptly in the past 5, which suggests potential confusion or frustration. You should be patient and provide extra encouragement.
  - Time Between Responses: The average time between the student’s questions and your responses is 15 minutes. Shorter, clearer responses could improve engagement.

4. Recent Feedback:
  - Rating: The student rated the previous response 4/5 stars.
  - Feedback: They found the explanation mostly helpful but desired more examples (rated as “lack of clarity in complex examples”). The student expressed satisfaction with responses being clear but suggested some topics could be broken down further.
  - Recent Interaction Summary:
    - Number of exchanges: 5
    - Rating variance: 1 point (3-5 stars) depending on explanation depth.

5. Specific Focus Areas:
  - Mathematics:
    - Focus: Advanced topics such as calculus and algebra.
    - Grade trend: Needs 2-3 additional examples per concept to improve understanding.

  - Programming:
    - Focus: Improving understanding of algorithms and data structures.
    - Grade trend: Minor dip in the last assignment, with an increase in challenges related to edge cases.

  - Data Science:
    - Focus: Statistical models and data cleaning.
    - Reinforcement needed: Additional 2-3 examples of regression and pre-processing techniques.

### Model's Suggested Action Plan:
Based on the RL model's analysis, please respond to the student's query as follows:
- Use a step-by-step approach, ensuring to provide 2-3 examples for each new concept.
- If the student shows signs of difficulty (such as hint requests), offer a follow-up to clarify the concept and encourage further engagement.
- Encourage the student to re-engage if an abrupt exit is noted, providing more detailed breakdowns and offering additional examples for clarity.
- Adapt the tone and level of detail according to the student’s current performance and the feedback received from previous sessions.


For context, here's the interaction you and the student have had:
[Student Interactions]

[Student Interactions End]

Furthermore, a gist of the student's material has been extracted. If the student's query requires anything from the following,
give priority to the following but if the following seems irrelevant, give priority to the student's query

[Relevant Knowledge]

[Relevant Knowledge End]

The student’s query is as follows:
[Student’s Query]
"""
@app.route("/api/tutor", methods=["POST"])
def tutor():
    global model
    user_input = request.json.get("query")
    history = request.json.get("history")
    feedback_metrics = request.json.get("feedback_metrics", {})

    start = time.time()

    if not user_input:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "response": "No query provided",
            "time": time.time() - start,
        })
    
    api_key = get_next_api_key()
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash-8b')
    
    relevant_docs = retrieve_relevant_docs(user_input, top_k=3)
    retrieved_knowledge = "\n".join(relevant_docs[0])
    
    print(history)

    full_prompt = f"{pre_prompt.replace('[Student Interactions]', history)}\n"
    full_prompt = f"{full_prompt.replace('[Relevant Knowledge]', retrieved_knowledge)}\n"
    full_prompt += f"Student’s Query:\n{user_input}\n\n"

    print(full_prompt)
    
    raw_response = model.generate_content(full_prompt)
    
    special_prompt = (
        history + user_input +
        "Analyze if the request is suited for a special action such as a flashcard, video response, or simulation. "
        "If needed, return a structured JSON object with a predefined ID relevant to the topic (for simulations):"
        "Otherwise, return null. Only JSON in raw text format and no other styling should be returned and here is the basic format: "
        "{\"special_act\": 1, \"data\": { \"id\": \"physics_ball_sim_gravity\", \"objects\": {} }}.\n"
        "Predefined IDs include:\n"
        "- physics_ball_sim_gravity (Physics: Gravity Simulation)\n"
        "- chemistry_molecule_3d (Chemistry: Molecule 3D Structure)\n"
        "- math_graph_interactive (Mathematics: Graph Plotting)\n"
        "- bio_dna_visualizer (Biology: DNA Structure)\n"
        "- coding_algorithm_visual (Computer Science: Algorithm Visualization)\n"
    )

    special_action = model.generate_content(special_prompt)
    
    print(special_action)

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
    
    extraction_prompt = (
        "Analyze the following response and extract key insights as a structured JSON object. "
        "The JSON should include: \"confidence\" (float, 0-1), \"response_time_correctness\" (object with expected_time, actual_time, deviation), "
        "\"fatigue_level\" (float, 0-1), and \"knowledge_level\" (float, 0-1). Ensure objectivity.\n"
        "Response:\n" + prev_response
    )
    
    extraction_result = extraction_model.generate_content(extraction_prompt)
    
    return jsonify({
        "code": HTTP_OK,
        "extracted_info": extraction_result.text
    })

if __name__ == "__main__":
    app.run(debug=True)
