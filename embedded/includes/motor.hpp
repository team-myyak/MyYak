#pragma once

#include <iostream>
#include <wiringPi.h>
#include <stdlib.h>
#include <string>
#include <vector>

#include "common.hpp"

#define SPEED 9
#define MOTOR_STEP 2048

void setup_motor();
void recv_move_motor();
void open_slot(int);
void close_slot(int);
