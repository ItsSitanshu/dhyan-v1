from flask import Flask, request, jsonify
import numpy as np
import vosk
import json
import wave

app = Flask(__name__)

# Load Vosk speech recognition model
model = vosk.Model("model")  # Replace with your Vosk model path
rec = vosk.KaldiRecognizer(model, 8000)  # 8kHz sample rate

@app.route("/audio", methods=["POST"])
def receive_audio():
    data = request.get_json()
    audio_string = data.get("audio", "")
    
    # Convert CSV-like audio data back to array
    audio_data = np.array([int(x) for x in audio_string.split(",")], dtype=np.int16)
    
    # Convert raw data to WAV format (Vosk requires WAV)
    with wave.open("temp.wav", "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit PCM
        wf.setframerate(8000)
        wf.writeframes(audio_data.tobytes())

    # Speech-to-Text
    with open("temp.wav", "rb") as f:
        audio = f.read()
        if rec.AcceptWaveform(audio):
            result = json.loads(rec.Result())
            return jsonify({"text": result.get("text", "")})
        else:
            return jsonify({"text": "Could not process audio"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
