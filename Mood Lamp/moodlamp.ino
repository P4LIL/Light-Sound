#include <WS2812.h>

WS2812 LED(27); // 27 LEDs

cRGB value;

int redValue = 20;
int greenValue = 20;
int blueValue = 20;

int redStepSize = 1;
int greenStepSize = 2;
int blueStepSize = 3;
int redInc = redStepSize;
int blueInc = blueStepSize;
int greenInc = greenStepSize;


unsigned long time;
unsigned long attractTime = 30000; // time for attract mode mS
boolean attractFlag = false;

//switches
int redPlus = 0;
int redMinus = 1;
int greenPlus = 2;
int greenMinus = 3;
int bluePlus = 4;
int blueMinus = 5;



/*led order
0-2 all
3-5 G+B
6-10 B
11-13 B+R
14-18 R
19-21 G+R
22-26 G

*/


void setup() {
  time = millis();
  LED.setOutput(10); // Digital Pin 10
  // switches
  pinMode(redPlus, INPUT_PULLUP);
  pinMode(redMinus, INPUT_PULLUP);
  pinMode(greenPlus, INPUT_PULLUP);
  pinMode(greenMinus, INPUT_PULLUP);
  pinMode(bluePlus, INPUT_PULLUP);
  pinMode(blueMinus, INPUT_PULLUP);

}

void loop() {
  readSwitches();
  setLEDs();

  if (millis() > time + attractTime )
  {
    attract();
  }
  delay (50);
}

void readSwitches() {
  // read switches
  if (!digitalRead(redPlus)) {
    redValue++;
    time = millis();
 
    if (redValue > 255) redValue = 255;
  }
  if (!digitalRead(redMinus)) {
    redValue--;
    time = millis();

    if (redValue < 0) redValue = 0;
  }

  if (!digitalRead(greenPlus)) {
    greenValue++;
    time = millis();
    if (greenValue > 255) greenValue = 255;
  }
  if (!digitalRead(greenMinus)) {
    greenValue--;
    time = millis();
    if (greenValue < 0) greenValue = 0;
  }

  if (!digitalRead(bluePlus)) {
    blueValue++;
    time = millis();
    if (blueValue > 255) blueValue = 255;
  }
  if (!digitalRead(blueMinus)) {
    blueValue--;
    time = millis();
    if (blueValue < 0) blueValue = 0;
  }

}


void setLEDs() {
  value.r = redValue; value.g = greenValue; value.b = blueValue; // RGB Value
  for (int i = 0; i < 3; i++) {
    LED.set_crgb_at(i, value);
  }
  value.r = 0; value.g = greenValue; value.b = blueValue; // RGB Value
  for (int i = 3; i < 6; i++) {
    LED.set_crgb_at(i, value);
  }
  value.r = 0; value.g = 0; value.b = blueValue; // RGB Value
  for (int i = 6; i < 11; i++) {
    LED.set_crgb_at(i, value);
  }
  value.r = redValue; value.g = 0; value.b = blueValue; // RGB Value
  for (int i = 11; i < 14; i++) {
    LED.set_crgb_at(i, value);
  }
  value.r = redValue; value.g = 0; value.b = 0; // RGB Value
  for (int i = 14; i < 19; i++) {
    LED.set_crgb_at(i, value);
  }
  value.r = redValue; value.g = greenValue; value.b = 0; // RGB Value
  for (int i = 19; i < 22; i++) {
    LED.set_crgb_at(i, value);
  }
  value.r = 0; value.g = greenValue; value.b = 0; // RGB Value
  for (int i = 22; i < 27; i++) {
    LED.set_crgb_at(i, value);
  }

  LED.sync(); // Sends the values to the LEDs

}

void attract() {

  // roll values
  if (redValue > 150) redInc =  -redStepSize;
  if ( redValue < 5) redInc =  redStepSize;
  redValue = redValue + redInc;
  if (greenValue > 150 ) greenInc =  -greenStepSize;
  if ( greenValue < 5) greenInc = greenStepSize;
  greenValue = greenValue + greenInc;
  if (blueValue > 150 ) blueInc =  -blueStepSize;
  if (blueValue < 5) blueInc = blueStepSize;
  blueValue = blueValue + blueInc;
}
