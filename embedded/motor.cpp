#include "motor.hpp"

std::vector<std::vector<bool>> step = {
	{LOW, LOW, LOW, HIGH},
	{LOW, LOW, HIGH, LOW},
	{LOW, HIGH, LOW, LOW},
	{HIGH, LOW, LOW, LOW}
};

std::vector<std::vector<int>> input_pins = {
	{26, 19, 13, 6},
	{21, 20, 16, 12},
	{10, 22, 27, 17},
	{1, 7, 8, 25}
};

double cycle = 1.3;

void setup_motor(){
	if(wiringPiSetupGpio() == -1){
		std::cout << "setup error\n";
		exit(1);
	}

	for(int i = 0; i < input_pins.size(); i++){
		for(int j = 0; j < 4; j++){
			pinMode(input_pins[i][j], OUTPUT);
			digitalWrite(input_pins[i][j], LOW);
		}
	}

	recv_move_motor();
}

void recv_move_motor(){
	std::unique_lock<std::mutex> lk(mtx_slot);

	while(true){
		cv_motor.wait(lk);

		if(is_slot_open){
			open_slot(motor_slot_number);
		}
		else{
			close_slot(motor_slot_number);
		}

		cv_motor.notify_all();
	}
}

void open_slot(int num){
	if(num <= 3){
		for(int i = 0; i < MOTOR_STEP * cycle; i++){
			for(int j = 0; j < 4; j++){
				digitalWrite(input_pins[num][j], step[i % 4][j]);
			}
			delay(SPEED);
			for(int j = 0; j < 4; j++){
				digitalWrite(input_pins[num][j], LOW);
			}
		}
	}
}

void close_slot(int num){
	if(num <= 3){
		for(int i = MOTOR_STEP * cycle; i > 0; i--){
			for(int j = 0; j < 4; j++){
				digitalWrite(input_pins[num][j], step[i % 4][j]);
			}
			delay(SPEED);
			for(int j = 0; j < 4; j++){
				digitalWrite(input_pins[num][j], LOW);
			}
		}
	}
}
