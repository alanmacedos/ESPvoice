#include <Wifi.h>
#include <Firebase_ESP_Client.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID "iPhone de Alan"
#define WIFI_PASSWORD "12345678"

/* 2. Define the API Key */
#define API_KEY "AIzaSyCw4vQ3ds1KMaFUpStquQwdSyUAXdQzV_c"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://temperaturecheck-a7073-default-rtdb.firebaseio.com/"

/* 4. Define the user Email and password that already added in your project */
#define USER_EMAIL "temperature-check@gmail.com"
#define USER_PASSWORD "alauinha"

// Define Firebase Data object
FirebaseData fbdo;
FirebaseData stream;
FirebaseAuth auth;
FirebaseConfig config;

const int ledPin = 2;

void streamTimeoutCallback(bool timeout)
{
    if (timeout)
    {
        Serial.println("Stream timeout, tentando reconectar...");
    }
}

void streamCallback(FirebaseStream data)
{
    int state = data.intData();

    Serial.print("Novo estado recebido: ");
    Serial.println(state);

    digitalWrite(ledPin, state);
}

void setup()
{
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, HIGH);

    Serial.begin(9600);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    /* Assign the api key (required) */
    config.api_key = API_KEY;

    /* Assign the user sign in credentials */
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    /* Assign the RTDB URL (required) */
    config.database_url = DATABASE_URL;

    //  WiFi reconnection enabled
    Firebase.reconnectNetwork(true);

    // Since v4.4.x, BearSSL engine was used, the SSL buffer need to be set.
    // Large data transmission may require larger RX buffer, otherwise connection issue or data read time out can be occurred.
    fbdo.setBSSLBufferSize(4096 /* Rx buffer size in bytes from 512 - 16384 */, 1024 /* Tx buffer size in bytes from 512 - 16384 */);

    Firebase.begin(&config, &auth);
    Firebase.setDoubleDigits(5);

    Firebase.RTDB.beginStream(&stream, "/motor/state");
    Firebase.RTDB.setStreamCallback(&stream, streamCallback, streamTimeoutCallback);
}

void loop()
{
    Firebase.ready();
}