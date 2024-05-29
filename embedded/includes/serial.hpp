#pragma once

#include <iostream>
#include <sys/socket.h>
#include <cstdlib>
#include <unistd.h>
#include <arpa/inet.h>
#include <thread>
#include <map>

#include "json/json.h"
#include "common.hpp"

void exit_serial();
void make_serial(std::string);
void error_handling(const char* message);
void recv_msg();
void send_msg();
void parse_json(std::string&);
std::string make_json(Json::Value root = Json::Value());
