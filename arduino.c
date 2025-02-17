#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_PC_IP:5000/audio";

#define MIC_PIN 34  // KY-037 connected to GPIO 34
#define SAMPLE_RATE 8000  // 8kHz sample rate
#define BUFFER_SIZE 256  // Adjust for performance

int16_t audioBuffer[BUFFER_SIZE];

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println("\nConnected to WiFi");
}

void loop() {
    // Capture audio samples
    for (int i = 0; i < BUFFER_SIZE; i++) {
        audioBuffer[i] = analogRead(MIC_PIN) - 2048; // Convert to signed 16-bit
        delayMicroseconds(1000000 / SAMPLE_RATE);
    }

    // Convert to a simple comma-separated string for transmission
    String audioData = "";
    for (int i = 0; i < BUFFER_SIZE; i++) {
        audioData += String(audioBuffer[i]) + ",";
    }

    // Send data to Python server
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"audio\": \"" + audioData + "\"}";
    int httpResponseCode = http.POST(payload);
    http.end();

    Serial.println("Sent audio data!");
    delay(200);  // Adjust based on latency
}
