#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>

// WiFi credentials
const char* ssid = "PRANIT";  
const char* password = "77777777";  

// Gemini API credentials
const char* Gemini_Token = "AIzaSyDzKr2HRdft5JWje6_fAqGbhJUlr-gClCU";  
const char* Gemini_Max_Tokens = "500";

// Web server instance
WebServer server(80);

// Microphone pin
const int micPin = 34;  // Connect KY-037 A0 pin to GPIO34 (or any other available analog pin)

// Function to communicate with Gemini API
String askGemini(String question) {
    HTTPClient https;
    String answer = "Error: No Response";
    
    if (https.begin("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + String(Gemini_Token))) {
        https.addHeader("Content-Type", "application/json");
        String payload = "{\"contents\": [{\"parts\":[{\"text\":\"" + question + "\"}]}],\"generationConfig\": {\"maxOutputTokens\": " + String(Gemini_Max_Tokens) + "}}";
        
        int httpCode = https.POST(payload);
        if (httpCode == HTTP_CODE_OK) {
            String response = https.getString();
            Serial.println(response);
            DynamicJsonDocument doc(4096);
            deserializeJson(doc, response);
            answer = doc["candidates"][0]["content"]["parts"][0]["text"].as<String>();
            answer.trim();
        } else {
            answer = "Error: API failed!";
        }
        https.end();
    } else {
        answer = "Error: No Connection!";
    }
    
    return answer;
}

// Handle root webpage
void handleRoot() {
    server.send(200, "text/html", R"rawliteral(
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dhyan AI</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .container { max-width: 500px; margin: auto; padding: 20px; border-radius: 12px; box-shadow: 0px 4px 10px rgba(0, 195, 255, 0.2); }
                input { width: 90%; padding: 12px; font-size: 16px; margin: 10px 0; border-radius: 8px; border: none; outline: none; text-align: center; }
                button { padding: 12px 18px; margin: 8px; font-size: 16px; cursor: pointer; border-radius: 8px; }
                .dark-mode { background-color: #121212; color: #ffffff; }
                .light-mode { background-color: #f5f5f5; color: #000000; }
                .dark-mode .container { background: #1e1e1e; color: #ffffff; }
                .light-mode .container { background: #ffffff; color: #000000; }
                .typing { font-size: 18px; color: #00ff88; }
            </style>
            <script>
                let isSpeaking = false;
                let darkMode = true;

                function toggleMode() {
                    darkMode = !darkMode;
                    document.body.className = darkMode ? "dark-mode" : "light-mode";
                    localStorage.setItem('darkMode', darkMode);
                }

                function startSpeechRecognition() {
                    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                    recognition.lang = 'en-US';
                    recognition.onresult = function(event) {
                        var transcript = event.results[0][0].transcript;
                        document.getElementById('question').value = transcript;
                        askAI(transcript);
                    }
                    recognition.start();
                }

                function askAI(question) {
                    let history = document.getElementById('history');
                    let entry = document.createElement('p');
                    entry.innerHTML = "<strong>You:</strong> " + question;
                    history.appendChild(entry);
                    
                    document.getElementById('answer').innerHTML = "<span class='typing'>Thinking...</span>";

                    fetch('/ask?query=' + encodeURIComponent(question))
                        .then(response => response.text())
                        .then(answer => {
                            document.getElementById('answer').innerHTML = "<strong>AI:</strong> " + answer;
                            speak(answer);
                        });
                }

                function speak(text) {
                    var speech = new SpeechSynthesisUtterance();
                    speech.text = text;
                    speech.lang = 'en-US';
                    speech.rate = 1.0;
                    speech.onstart = function() { isSpeaking = true; fetch('/startSpeaking'); };
                    speech.onend = function() { isSpeaking = false; fetch('/stopSpeaking'); };
                    window.speechSynthesis.speak(speech);
                }

                function stopSpeaking() {
                    if (isSpeaking) {
                        window.speechSynthesis.cancel();
                        document.getElementById('answer').innerHTML = "⛔ Answer stopped!";
                        isSpeaking = false;
                        fetch('/stopSpeaking');
                    }
                }

                window.onload = function() {
                    darkMode = localStorage.getItem('darkMode') === 'true';
                    document.body.className = darkMode ? "dark-mode" : "light-mode";
                };
            </script>
        </head>
        <body class="dark-mode">
            <h2>🧠 Dhyan AI</h2>
            <button onclick="toggleMode()">🌗 Toggle Dark/Light Mode</button>
            <div class="container">
                <input type="text" id="question" placeholder="Ask something...">
                <button onclick="askAI(document.getElementById('question').value)">💡 Ask</button>
                <button onclick="startSpeechRecognition()">🎤 Speak</button>
                <button onclick="stopSpeaking()">🛑 Stop</button>
                <p id="answer"></p>
                <h3>Chat History</h3>
                <div id="history"></div>
            </div>
        </body>
        </html>
    )rawliteral");
}

// Handle AI queries
void handleAsk() {
    if (server.hasArg("query")) {
        String question = server.arg("query");
        String answer = askGemini(question);
        server.send(200, "text/plain", answer);
    } else {
        server.send(400, "text/plain", "No question provided!");
    }
}

// Handle speaking status
void handleStartSpeaking() { /* Optional actions while speaking */ }
void handleStopSpeaking() { /* Optional actions when speech stops */ }

// Microphone handling functions
int readMic() {
    int micValue = analogRead(micPin);  // Read the analog value from the microphone
    return micValue;
}

void checkForSound() {
    int micLevel = readMic();
    Se