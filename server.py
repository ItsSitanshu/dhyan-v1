import os
import time
import google.generativeai as genai
from flask_cors import CORS
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from codes import * 

load_dotenv()

API_KEY = os.getenv("API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash-8b')

app = Flask(__name__)
CORS(app)

pre_prompt = """
You are a highly skilled tutor who excels at providing clear, comprehensive explanations tailored to the student’s 
needs. Your responses should integrate the following quantitative and qualitative feedback, provided by an RL 
model designed to optimize learning outcomes based on the student's academic performance, engagement, and recent
feedback. The student’s data is as follows:

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

For general context, here's the interaction you and the student have had
[Student Interactions]

[Student Interactions End]

The student’s query is as follows:
[Student’s Query]
"""

@app.route("/api/rllm", methods=["POST"])
def ask():
  user_input = request.json.get("query")
  history = request.json.get("history")

  start = time.time()

  if not user_input:
    end = time.time()
    return jsonify({
      "code": HTTP_BAD_REQUEST,
      "response": "No query provided",
      "time": end - start,
    })

  print(history)
  
  full_prompt = pre_prompt.replace("[Student Interactions]", history)

  full_prompt = full_prompt.replace("[Student’s Query]", user_input)

  print(full_prompt)

  raw_response = model.generate_content(full_prompt)

  end = time.time()

  response = raw_response.text

  return jsonify({
    "code": HTTP_OK,
    "response": response,
    "time": end - start,
  })

if __name__ == "__main__":
  app.run(debug=True)
