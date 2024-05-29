#include <iostream>
#include <string>
#include <thread>
#include <csignal>
#include <exception>

#include "qtmain.hpp"
#include "serial.hpp"
#include "motor.hpp"
#include "common.hpp"

void signal_handler(int sig_num){
	exit_serial();
	std::cout << "signal exit\n";
	quick_exit(0);
}

int main(int argc, char* argv[]){
	signal(SIGINT, signal_handler);

	if(argc != 2){
		std::cout << "usage : ./program serial_number\n";
		exit(1);
	}

	std::thread thread_qt = std::thread(make_window);
	std::thread thread_serial = std::thread(make_serial, argv[1]);
	std::thread thread_motor = std::thread(setup_motor);

	thread_qt.join();
	thread_serial.join();
	thread_motor.join();

	return 0;
}
