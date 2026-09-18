#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "secrets.h"

// Define Firebase Data object
FirebaseData fbdo;
FirebaseData stream;
FirebaseAuth auth;
FirebaseConfig config;

const int ledPin = 2;
bool streamStarted = false;

void streamTimeoutCallback(bool timeout)
{
    if (timeout)
    {
        Serial.println("Stream timeout, tentando reconectar...");
    }
}

void streamCallback(FirebaseStream data)
{
    int state = data.intData() ? HIGH : LOW;

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

}

void loop()
{
    if (Firebase.ready() && !streamStarted)
    {
        if (Firebase.RTDB.beginStream(&stream, "/motor/state"))
        {
            Firebase.RTDB.setStreamCallback(&stream, streamCallback, streamTimeoutCallback);
            streamStarted = true;
            Serial.println("Firebase stream conectado.");
        }
        else
        {
            Serial.printf("Falha ao abrir stream: %s\n", stream.errorReason().c_str());
            delay(3000);
        }
    }
}
