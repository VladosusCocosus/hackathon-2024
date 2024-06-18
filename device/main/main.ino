#include <Preferences.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define WIRE Wire
#define ledPin 2
#define greenLed 13
#define redLed 12
#define MAX_STRING_LENGTH 50
#define i2c_Address 0x3c //initialize with the I2C addr 0x3C Typically cheap OLED's


#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

Adafruit_SSD1306 display = Adafruit_SSD1306(SCREEN_WIDTH, SCREEN_HEIGHT, &WIRE);
Preferences prefs;


boolean newData = false;

int command;

char input[120] = {};

enum commands {
  ID = 1
  GET_NAME=2
  GET_WIFI_STATUS=3
}

enum statuses {
  Success = 1,
  Error = 2,
  Running = 3
}

struct Info {
  char providerName[40];
  int status;
  char msg[100];
  char author[100];
}

Info info[20];


void sutupDisplay() {
  delay(250); // wait for the OLED to power up
  display.begin(SSD1306_SWITCHCAPVCC, i2c_Address);

  display.display();
  delay(1000);


  display.clearDisplay();
  display.display();
}

void setup() {
  Serial.begin(115200);

  sutupDisplay();
}

void loop() {
  receiveCommands();
  executer();
1
  delay(1000);
}

void receiveCommands() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    byte startMarker = 0x3C;
    byte endMarker = 0x3E;
    byte rb;

    while (Serial.available() > 0) {
        rb = Serial.read();

        if (recvInProgress == true) {
            if (rb != endMarker) {
                command[ndx] = (char) rb;
                ++ndx;
            }
            else {
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }
        else if (rb == startMarker) {
            recvInProgress = true;
        }
    }
}

void getCommand(char string[120]) {
    int i = 0;
    while (string[i] != 0) {
        if (string[i] == '|') {
            break;
        }
        commandName[i] = string[i];
        ++i;
    }
}

void getValues(char string[120]) {
    int i = 0;
    int value = 0;
    int idx = 0;
    int stringIndex = 0;
    while (string[i] != 0) {
        if (string[i] == '|') {
            if (value) {
                ++idx;
                stringIndex = 0;
            }

            value = 1;
            ++i;
            continue;
        }

        if (!value) {
            ++i;
            continue;
        }

        values[idx][stringIndex] = string[i];
        ++stringIndex;
        ++i;
    }
}


void executer() {
  if (newData == true) {
    getCommand(command);
    getValues(command);

    if (commandName[0] == '1') {
     getPNL(values[0]);
    }

    if (commandName[0] == '2') {
     sendDeviceName();
    }

    if (commandName[0] == '3') {
      getCurrentBroker(values[0]);
      getCurrentPosition(values[1]);
      getCurrentPositionPNL(values[2]);
    }

    memset(command, 0, sizeof(command));
    memset(commandName, 0, sizeof(commandName));

    show();

    for (int i = 0; i < 10; i++) {
      for (int k = 0; k < 30; k++) {
        values[i][k] = 0;
      }
    }

    newData = false;
  }
}

void getPNL(char* pnlv) {
  Serial.print("getting PNL:");
  Serial.println(pnlv);


  pnl = strtof(pnlv, NULL);
  Serial.print("Result:");
  Serial.println(pnl);
}

void getCurrentPositionPNL(char* pnlv) {
  positionPNL = strtof(pnlv, NULL);
}

void getCurrentBroker(char* brokerv) {
  strncpy(broker, brokerv, 30);
}

void getCurrentPosition(char* positionNamev) {
  strncpy(positionName, positionNamev, 30);
}

void show() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.print(F("PNL: "));
  display.println(pnl);


  display.print(broker);
  display.print(F(" - "));

  display.println(positionName);

  display.setTextSize(2);
  display.print(positionPNL);

  display.setTextSize(1);

  display.display();
}

void sendDeviceName() {
  Serial.println("<name|Small Device V1>");
}
