#include <EEPROM.h>


//#include <avr/io.h>

// pins


int disp_A = 4;
int disp_B = 5;
int disp_C = 6;
int disp_D = 7;
int disp_G1 = 3;
int disp_R1 = 2;
int disp_L = 8;
int disp_S = 9;
int disp_EN = 10;
int LED = 13;
int pin_adc = A0;

const boolean hilo = true; // display LO HI on screen
const boolean doubleBars = false;

int xdelay = 100;
int dataBuffer[64];    // 64 data lines values of 0 to 16
int noisefloor[64];    // offset for noisefloor

int j;

//fht
#define LIN_OUT 1 // use the lin output function
#define FHT_N 256
// set to 256 point fht

#include <FHT.h> // include the library

void setup() {

  // setup pins
  pinMode(disp_A, OUTPUT);
  pinMode(disp_B, OUTPUT);
  pinMode(disp_C, OUTPUT);
  pinMode(disp_D, OUTPUT);
  pinMode(disp_G1, OUTPUT);
  pinMode(disp_R1, OUTPUT);
  pinMode(disp_L, OUTPUT);
  pinMode(disp_S, OUTPUT);
  pinMode(disp_EN, OUTPUT);
  pinMode(LED, OUTPUT);

  // fill data with random values
  randomSeed(analogRead(5));
  setalloff();
  setNoiseFloor();
  //fht
  TIMSK0 = 0; // turn off timer0 for lower jitter
  ADCSRA = 0xe6; // set the adc to free running mode
  ADMUX = 0x40; // use adc0
  DIDR0 = 0x01; // turn off the digital input for adc0


  // eeprom

  if (EEPROM.read(0) != 1) {
    setNoiseFloor();
  }
}

void loop() {
  fht();
  disp();
}



void disp() {
  for (byte row = 0; row < 16; row++) {   // loop through rows
    //for (byte column = 0; column < 64; column++) { // loop through columns upside down
    for (int column = 63; column > -1; column--) { // loop through columns upright
      // set r1,g1

      // setupdisplay bars
      if (!doubleBars) {
        if (dataBuffer[column] == row) { // green peak
          PORTD &= ~_BV(PORTD3) ;  // clear G1 - on
        }
        else {
          PORTD |= _BV(PORTD3); //set G1 - off
        }
        if (dataBuffer[column] > row) {
          PORTD &= ~_BV(PORTD2) ;  // clear R1 - on
        }
        else {
          PORTD |= _BV(PORTD2); //set R1 - off
        }
      }

      else {
        // every even row and 0
        if (!(column % 2)) {

          if (dataBuffer[column] == row) { // green peak
            PORTD &= ~_BV(PORTD3) ;  // clear G1 - on
          }
          else {
            PORTD |= _BV(PORTD3); //set G1 - off
          }
          if (dataBuffer[column] > row) {
            PORTD &= ~_BV(PORTD2) ;  // clear R1 - on
          }
          else {
            PORTD |= _BV(PORTD2); //set R1 - off
          }
        }

      }
      if (hilo) {
        if ( ((row == 14) | (row == 13) | (row == 12)) & (column > 56 | column < 6)) {
          // setup LO and LH
          // if ((column == 62) & ((row == 14) | (row == 13) | (row == 12))) {
          if (column == 62) {
            PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          if ((column == 61) & ((row == 12))) {
            PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          //if ((column == 59) & ((row == 14) | (row == 13) | (row == 12))) {
          if (column == 59) {
          PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          if ((column == 58) & ((row == 14) | (row == 12))) {
          PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          //if ((column == 57) & ((row == 14) | (row == 13) | (row == 12))) {
          if (column == 57) {
          PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          //if ((column == 5) & ((row == 14) | (row == 13) | (row == 12))) {
          if (column == 5) {
          PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          if ((column == 4) & (row == 13)) {
          PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          //if ((column == 3) & ((row == 14) | (row == 13) | (row == 12))) {
          if (column == 3) {
          PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
          //if ((column == 1) & ((row == 14) | (row == 13) | (row == 12))) {
          if (column == 1) {
          PORTD = (PORTD & B11110011) ; // clear R1,G1
          }
        }
      }
      PORTB |= _BV(PORTB1); //digitalWrite(disp_S, HIGH);
      PORTB &= ~_BV(PORTB1); //digitalWrite(disp_S, LOW);
      PORTB |= _BV(PORTB1); //digitalWrite(disp_S, HIGH);
    }

    PORTB |= _BV(PORTB2); //digitalWrite(disp_EN, HIGH);
    //PORTD = (PORTD & 15) | (row << 4); // set row upside down
    PORTD = ~((PORTD & 15) | (row << 4)); // set row upright
    PORTB |= _BV(PORTB0); //digitalWrite(disp_L, HIGH);
    PORTB &= ~_BV(PORTB0); //digitalWrite(disp_L, LOW);          // latch data
    PORTB &= ~_BV(PORTB2); // digitalWrite(disp_EN, LOW);

  }
}

void fht() {
  cli();  // UDRE interrupt slows this way down on arduino1.0
  for (int i = 0 ; i < FHT_N ; i++) { // save 256 samples
    while (!(ADCSRA & 0x10)); // wait for adc to be ready
    ADCSRA = 0xf6; // restart adc
    byte m = ADCL; // fetch adc data
    byte j = ADCH;
    int k = (j << 8) | m; // form into an int
    k -= 0x0200; // form into a signed int
    k <<= 6; // form into a 16b signed int
    fht_input[i] = k; // put real data into bins
  }
  disp();
  fht_window(); // window the data for better frequency response

  fht_reorder(); // reorder the data before doing the fht
  // disp();
  fht_run(); // process the data in the fht

  fht_mag_lin(); // take the output of the fht
  //disp();
  //for (j=1; j< 65;j++){
  //  fht_lin_out[j]=map(int(fht_lin_out[j]),0,512,0,15);
  //}
  for (j = 1; j < 65; j++) {
    dataBuffer[j - 1] = constrain((fht_lin_out[66 - j] - EEPROM.read(j)) / 32, 0, 15);
  }
  sei();
}

void setNoiseFloor()
{
  EEPROM.write(0, 1); // address 0 1==eeprom written
  for (int i = 1; i < 65; i++) {
    EEPROM.write(i, 0);
  }
}

void readNoiseFloor() {
}


void setalloff()
{
  for (int i = 1; i < 65; i++) {
    dataBuffer[i] = 1;
  }
}




















