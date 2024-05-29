#include "serial.hpp"

#define REQUEST_MAX (1 << 30)

int serv_sock;
std::thread recv_thread, send_thread;
char json_buf[BUF_SIZE];
std::map<int, RequestType> request_map;
std::mutex mtx_map;
std::vector<std::string> app_request_list = {"openSlot", "addMed", "delMed"};
std::queue<Json::Value> app_response_queue;
std::string sn;

Json::CharReaderBuilder builder;
Json::CharReader *reader = NULL;
Json::FastWriter fast_writer;

void exit_serial(){
	close(serv_sock);
}

void make_serial(std::string serial_number){
	serv_sock = socket(PF_INET, SOCK_STREAM, 0);
	if(serv_sock == -1){
		error_handling("socket() error");
	}

	struct sockaddr_in serv_addr;
	memset(&serv_addr, 0, sizeof(serv_addr));
	serv_addr.sin_family = AF_INET;
	serv_addr.sin_port = htons(atoi("65432"));
	serv_addr.sin_addr.s_addr = inet_addr("43.203.172.68");

	if(connect(serv_sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) == -1){
		error_handling("connect() error");
	}

	reader = builder.newCharReader();

	sn = serial_number;

	recv_thread = std::thread(recv_msg);
	send_thread = std::thread(send_msg);

	recv_thread.join();
	send_thread.join();

	close(serv_sock);
}

void error_handling(const char* message){
	fputs(message, stderr);
	fputc('\n', stderr);
	exit(1);
}

void recv_msg(){
	int recv_size = 0;
	std::string parsing_buf;

	while(true){
		memset(json_buf, 0, BUF_SIZE);
		int read_len = read(serv_sock, json_buf, BUF_SIZE - 1);
		
		if(read_len == 0){
			close(serv_sock);
			break;
		}
		
		if(recv_size == 0){
			for(int i = 0; i < 4; i++){
				recv_size = recv_size * 10 + (json_buf[i] - '0');
				json_buf[i] = ' ';
			}
			read_len -= 4;
			parsing_buf = "";
		}
		parsing_buf += json_buf;
		recv_size -= read_len;

		if(recv_size == 0){
			std::lock_guard<std::mutex> lk(mtx_read);

			parse_json(parsing_buf);
		}
	}
}

void send_msg(){
	std::unique_lock<std::mutex> lk(mtx_write);

	write(serv_sock, sn.c_str(), sn.size());

	while(true){
		if(request_queue.empty() && app_response_queue.empty()){
			cv_write.wait(lk);
		}

		std::string request_str;

		if(!app_response_queue.empty()){
			request_str = make_json(app_response_queue.front());
			app_response_queue.pop();
		}
		else{
			request_str = make_json();
		}
		write(serv_sock, request_str.c_str(), request_str.size());
	}
}

void parse_json(std::string& json_buf){	
	Json::Value root;
	JSONCPP_STRING err;
	bool ok = reader->parse(json_buf.c_str(), json_buf.c_str() + json_buf.size(), &root, &err);

	if(ok){
		if(root.isMember("requestNumber")){
			int recv_request_num = root["requestNumber"].asInt();
			read_check.insert(recv_request_num);
			cur_read = recv_request_num;

			mtx_map.lock();
			std::map<int, RequestType>::iterator map_it = request_map.find(recv_request_num);
			RequestType recv_request_type = map_it->second;
			request_map.erase(map_it);
			mtx_map.unlock();

			int size = 0;
			if(recv_request_type != REQUEST_MEDICINE){
				size = root["count"].asInt();
			}
			switch(recv_request_type){
				case REQUEST_SLOT:
					med_list_slot.clear();
					for(int i = 0; i < size; i++){
						Json::Value &cur = root["result"][i];
						med_list_slot.emplace_back(cur["medName"].asString(), cur["slotId"].asInt64(), cur["slotNumber"].asInt() - 1, cur["medExist"].asBool());
					}
					break;
				case REQUEST_SYMPTOM:
					{
						std::vector<int> symptom_vector;
						for(int i = 0; i < size; i++){
							symptom_vector.push_back(root["result"][i].asInt() - 1);
						}
						med_list_symptom.insert({recv_request_num, symptom_vector});
					}
					break;
				case REQUEST_USER:
					{
						std::vector<User> user_vector;
						for(int i = 0; i < size; i++){
							Json::Value &cur = root["result"][i];
							user_vector.emplace_back(cur["userName"].asString(), cur["userId"].asInt64());
						}
						user_list.insert({recv_request_num, user_vector});
					}
					break;
				case REQUEST_BOOKMARK:
					{
						std::vector<BookmarkByUser> bookmark_vector;
						for(int i = 0; i < size; i++){
							Json::Value &cur = root["result"][i];
							bookmark_vector.emplace_back(cur["medName"].asString(), cur["slotNumber"].asInt() - 1, i);
						}
						bookmark_list_user.insert({recv_request_num, bookmark_vector});
					}
					break;
				case REQUEST_MEDICINE:
					medicine_info = Medicine(root["slotNumber"].asInt(), root["medName"].asString(), root["slotExp"].asString(), root["medMethod"].asString(), root["medWarning"].asString());
					break;
			} // end switch case
			cv_read.notify_all();
		} // end id display
		else if(root.isMember("requestName")){
			if(valid_app_request){
				std::lock_guard<std::mutex> lk(mtx_app);
				if(root["requestName"].asString().compare(app_request_list[0]) == 0){
					app_request = APP_REQUEST_OPEN;
					app_slot_id = root["slotId"].asInt64();
				}
				else if(root["requestName"].asString().compare(app_request_list[1]) == 0){
					app_request = APP_REQUEST_ADD;
				}
				else if(root["requestName"].asString().compare(app_request_list[2]) == 0){
					app_request = APP_REQUEST_DELETE;
				}

				app_slot_number = root["slotNumber"].asInt() - 1;
				cv_app.notify_one();
				root["isDone"] = "True";
			}
			else{
				root["isDone"] = "False";
			}
			root["requestType"] = "open";
			root["requestName"] = "feedback";

			mtx_write.lock();
			app_response_queue.push(root);
			mtx_write.unlock();
			cv_write.notify_one();
		}
	}
}

std::string make_json(Json::Value root){
	if(root.isNull()){
		Request cur_request = request_queue.front();
		request_queue.pop();

		mtx_map.lock();
		request_map.emplace(cur_request.req_num, cur_request.req_type);
		mtx_map.unlock();

		root["serialNumber"] = serial_number;
		root["requestNumber"] = cur_request.req_num;

		switch(cur_request.req_type){
			case REQUEST_SLOT:
				root["requestName"] = "getSlotInfoList";
				break;
			case REQUEST_SYMPTOM:
				root["requestName"] = "getMedBySym";
				root["symptom"] = selected_symptom.find(cur_request.req_num)->second;
				break;
			case REQUEST_USER:
				root["requestName"] = "getUserList";
				break;
			case REQUEST_BOOKMARK:
				root["requestName"] = "getUserBookList";
				root["userId"] = static_cast<int64_t>(selected_user_id.find(cur_request.req_num)->second);
				break;
			case REQUEST_MEDICINE:
				root["requestName"] = "getMedInfo";
				root["slotId"] = static_cast<int64_t>(selected_slot_id.find(cur_request.req_num)->second);
				root["isSelectedUser"] = (selected_user_id.find(cur_request.req_num)->second == -1 ? "true" : "false");
				root["userId"] = static_cast<int64_t>(selected_user_id.find(cur_request.req_num)->second);
				break;
		} // end switch case
	}

	return fast_writer.write(root);
}
