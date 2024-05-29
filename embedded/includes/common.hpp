#pragma once

#include <mutex>
#include <condition_variable>
#include <cstring>
#include <string>
#include <vector>
#include <queue>
#include <map>
#include <set>

#define BUF_SIZE 5000

enum RequestType{
	REQUEST_SLOT,
	REQUEST_SYMPTOM,
	REQUEST_USER,
	REQUEST_BOOKMARK,
	REQUEST_MEDICINE
};

enum AppRequestType{
	APP_REQUEST_OPEN,
	APP_REQUEST_ADD,
	APP_REQUEST_DELETE
};

struct Request{
	RequestType req_type;
	int req_num;

	Request();
	Request(RequestType, int);
};

struct MedBySlot{
	std::string med_name;
	long long slot_id;
	int slot_number;
	bool med_exist;

	MedBySlot();
	MedBySlot(int, bool);
	MedBySlot(std::string, long long, int, bool);
};

struct User{
	std::string user_name;
	long long user_id;

	User();
	User(std::string, long long);
};

struct BookmarkByUser{
	std::string med_name;
	int slot_number;
	int bookmark_order;

	BookmarkByUser();
	BookmarkByUser(std::string, int, int);
};

struct Medicine{
	int slot_number;
	std::string med_name;
	std::string slot_exp;
	std::string med_method;
	std::string med_warning;

	Medicine();
	Medicine(int, std::string, std::string, std::string, std::string);
};

extern std::string serial_number;

extern std::mutex mtx_write;				// write to server mutex
extern std::condition_variable cv_write;	// ui to serial notify
extern char buf_write[BUF_SIZE];			// write buffer
extern std::queue<Request> request_queue;    //.ui click request type enum queue
extern std::map<int, std::string> selected_symptom;
extern std::map<int, long long> selected_user_id;
extern std::map<int, long long> selected_slot_id;

extern int cur_read;
extern std::mutex mtx_read;					// read from server mutex
extern std::condition_variable cv_read;		// serial to ui notify
extern char buf_read[BUF_SIZE];				// read buffer
extern std::set<int> read_check;
extern std::vector<std::string> symptom_list;
extern std::vector<MedBySlot> med_list_slot;
extern std::map<int, std::vector<int>> med_list_symptom;
extern std::map<int, std::vector<User>> user_list;
extern std::map<int, std::vector<BookmarkByUser>> bookmark_list_user;
extern Medicine medicine_info;

extern std::mutex mtx_app;
extern std::condition_variable cv_app;
extern AppRequestType app_request;
extern bool valid_app_request;
extern int app_slot_number;
extern long long app_slot_id;

extern std::mutex mtx_slot;
extern std::condition_variable cv_motor;
extern int motor_slot_number;
extern bool is_slot_open;
