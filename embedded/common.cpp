#include "common.hpp"

Request::Request(){}

Request::Request(RequestType type, int num) : req_type(type), req_num(num) {}

MedBySlot::MedBySlot(){}

MedBySlot::MedBySlot(int number, bool exist) : slot_number(number), med_exist(exist){}

MedBySlot::MedBySlot(std::string name, long long id, int number, bool exist) : med_name(name), slot_id(id), slot_number(number), med_exist(exist){}

User::User(){}

User::User(std::string name, long long id) : user_name(name), user_id(id) {}

BookmarkByUser::BookmarkByUser(){}

BookmarkByUser::BookmarkByUser(std::string name, int number, int order) : med_name(name), slot_number(number), bookmark_order(order){}

Medicine::Medicine(){}

Medicine::Medicine(int number, std::string name, std::string exp, std::string method, std::string warning) : slot_number(number), med_name(name), slot_exp(exp), med_method(method), med_warning(warning){}

std::string serial_number;

std::mutex mtx_write;
std::condition_variable cv_write;
char buf_write[BUF_SIZE];
std::queue<Request> request_queue;
std::map<int, std::string> selected_symptom;
std::map<int, long long> selected_user_id;
std::map<int, long long> selected_slot_id;

int cur_read;
std::mutex mtx_read;
std::condition_variable cv_read;
char buf_read[BUF_SIZE];
std::set<int> read_check;
std::vector<std::string> symptom_list;
std::vector<MedBySlot> med_list_slot;
std::map<int, std::vector<int>> med_list_symptom;
std::map<int, std::vector<User>> user_list;
std::map<int, std::vector<BookmarkByUser>> bookmark_list_user;
Medicine medicine_info;

std::mutex mtx_app;
std::condition_variable cv_app;
AppRequestType app_request;
bool valid_app_request = true;
int app_slot_number;
long long app_slot_id;

std::mutex mtx_slot;
std::condition_variable cv_motor;
int motor_slot_number;
bool is_slot_open;
