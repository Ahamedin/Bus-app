// ═══════════════════════════════════════════════════════════════
//  BUS SEAT ALERT SYSTEM — ESP32 Firmware
//  Hardware: NEO-6M GPS · SG90 Servo · Vibration Motor via Relay
//  Backend:  Node.js at http://<YOUR_PC_IP>:5000
// ═══════════════════════════════════════════════════════════════

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <TinyGPSPlus.h>
#include <ESP32Servo.h>

// ── 1. WiFi Credentials ──────────────────────────────────────
#define WIFI_SSID     "YOUR_WIFI_NAME"       // ← Change this
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"   // ← Change this

// ── 2. Backend Server URL ─────────────────────────────────────
//    Run ipconfig in PowerShell → copy your IPv4 Address
#define SERVER_URL    "http://192.168.1.3:5000"  // ✅ Your PC's IP

// ── 3. GPIO Pin Definitions ──────────────────────────────────
#define GPS_RX_PIN     16   // NEO-6M TX → ESP32 GPIO16
#define GPS_TX_PIN     17   // NEO-6M RX → ESP32 GPIO17
#define SERVO_PIN      18   // Servo signal → GPIO18
#define RELAY_PIN      26   // Relay IN    → GPIO26 (active LOW)

// ── 4. Timing (milliseconds) ─────────────────────────────────
#define GPS_SEND_INTERVAL    5000   // Send GPS every 5 seconds
#define ALERT_CHECK_INTERVAL 3000   // Poll alert every 3 seconds

// ── 5. Objects ───────────────────────────────────────────────
TinyGPSPlus     gps;
HardwareSerial  gpsSerial(2);   // UART2: GPIO16=RX, GPIO17=TX
Servo           alertServo;

// ── 6. State Variables ───────────────────────────────────────
bool   alertTriggered  = false;
bool   wifiConnected   = false;
unsigned long lastGpsSend    = 0;
unsigned long lastAlertCheck = 0;

// ════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  Serial.println("\n\n🚌 Bus Seat Alert System Starting...");

  // GPIO Setup
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  // HIGH = Relay OFF (active LOW module)

  // Initial servo check and detach (save power)
  ESP32PWM::allocateTimer(0);
  alertServo.setPeriodHertz(50);
  alertServo.attach(SERVO_PIN, 500, 2400); 
  alertServo.write(0);
  delay(500);
  alertServo.detach();



  // GPS Serial
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  Serial.println("✅ GPS serial started on UART2");

  // WiFi
  connectWiFi();
}

// ════════════════════════════════════════════════════════════
void loop() {
  // 1. Feed GPS data continuously
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  unsigned long now = millis();

  // 2. Send GPS to backend every 5 seconds
  if (now - lastGpsSend >= GPS_SEND_INTERVAL) {
    lastGpsSend = now;

    if (!WiFi.isConnected()) {
      Serial.println("⚠️  WiFi lost — reconnecting...");
      connectWiFi();
    }

    if (gps.location.isValid()) {
      sendGPS(gps.location.lat(), gps.location.lng());
    } else {
      Serial.printf("⏳ GPS: waiting for fix... Satellites: %d\n",
                    gps.satellites.value());
    }
  }

  // 3. Poll backend for alert every 3 seconds
  if (now - lastAlertCheck >= ALERT_CHECK_INTERVAL) {
    lastAlertCheck = now;
    checkAlert();
  }
}

// ════════════════════════════════════════════════════════════
//  WiFi Connection
// ════════════════════════════════════════════════════════════
void connectWiFi() {
  Serial.printf("📶 Connecting to WiFi: %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.printf("\n✅ WiFi connected! IP: %s\n",
                  WiFi.localIP().toString().c_str());
  } else {
    wifiConnected = false;
    Serial.println("\n❌ WiFi connection failed — will retry next cycle");
  }
}

// ════════════════════════════════════════════════════════════
//  Send GPS Coordinates to Backend
//  POST /api/gps/update  { lat, lng }
// ════════════════════════════════════════════════════════════
void sendGPS(double lat, double lng) {
  if (!WiFi.isConnected()) return;

  HTTPClient http;
  String url = String(SERVER_URL) + "/api/gps/update";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000);

  // Build JSON body
  String body = "{\"lat\":" + String(lat, 6) +
                ",\"lng\":" + String(lng, 6) + "}";

  Serial.printf("📡 Sending GPS → (%.6f, %.6f)\n", lat, lng);

  int statusCode = http.POST(body);

  if (statusCode == 200) {
    String resp = http.getString();

    // Parse response to check alertActive directly from GPS update
    StaticJsonDocument<256> doc;
    if (!deserializeJson(doc, resp)) {
      bool active = doc["alertActive"] | false;
      Serial.printf("   ✅ Backend OK | alertActive: %s\n",
                    active ? "YES" : "no");
    }
  } else {
    Serial.printf("   ❌ GPS send failed — HTTP %d\n", statusCode);
  }

  http.end();
}

// ════════════════════════════════════════════════════════════
//  Poll Backend for Alert Status
//  GET /api/gps/alert-status → { alert: true/false }
// ════════════════════════════════════════════════════════════
void checkAlert() {
  if (!WiFi.isConnected()) return;

  HTTPClient http;
  String url = String(SERVER_URL) + "/api/gps/alert-status";

  http.begin(url);
  http.setTimeout(5000);

  int statusCode = http.GET();

  if (statusCode == 200) {
    String resp = http.getString();

    StaticJsonDocument<256> doc;
    if (!deserializeJson(doc, resp)) {
      bool shouldAlert = doc["alert"] | false;

      if (shouldAlert && !alertTriggered) {
        Serial.println("🚨 ALERT RECEIVED — Waking passenger!");
        alertTriggered = true;
        triggerAlert();
      } else if (!shouldAlert && alertTriggered) {
        // Reset when trip ends
        alertTriggered = false;
        Serial.println("ℹ️  Alert cleared — standby");
      }
    }
  } else {
    Serial.printf("⚠️  Alert check failed — HTTP %d\n", statusCode);
  }

  http.end();
}

// ════════════════════════════════════════════════════════════
//  Trigger Physical Alert — Relay (vibration) + Servo (tap)
// ════════════════════════════════════════════════════════════
void triggerAlert() {
  Serial.println("⚡ [ALERT] Starting hardware sequence...");

  // ── 1. Vibration Motor ──────────────────────────────────
  Serial.println("📳 Buzzing vibration motor...");
  for (int i = 0; i < 3; i++) {
    digitalWrite(RELAY_PIN, LOW);   // ON
    delay(500);
    digitalWrite(RELAY_PIN, HIGH);  // OFF
    delay(300);
  }

  delay(500);

  // ── 2. Servo Motor ──────────────────────────────────────
  Serial.println("🦾 Moving servo (0° -> 90°)...");
  alertServo.attach(SERVO_PIN, 500, 2400); // RE-ATTACH to move
  for (int i = 0; i < 3; i++) {
    alertServo.write(90);   // Tap
    Serial.println("   -> Position 90");
    delay(1000);
    alertServo.write(0);    // Back
    Serial.println("   -> Position 0");
    delay(1000);
  }

  // Final shutoff ensure
  digitalWrite(RELAY_PIN, HIGH);
  alertServo.write(0);
  delay(500);
  alertServo.detach(); // DETACH (Stop sending signal/current)
  Serial.println("✅ [ALERT] Hardware sequence finished");
}


