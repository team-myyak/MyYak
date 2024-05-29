#include "mainwindow.h"
#include "./ui_mainwindow.h"

enum Menu {
	MENU_EMPTY,
	MENU_SYMPTOM,
	MENU_BOOKMARK
};

std::vector<int> clear_slot;
Menu cur_menu;
bool valid_button[SLOT_MAX];
long long cur_user = -1;
int cur_symptom = -1;
int cur_bookmark_order = -1;
int cur_user_num = -1;
int cnt = 0;
int time_cnt = 5;
std::vector<QPushButton*> buttons(SLOT_MAX);
QGridLayout* bookmark_list_layout = NULL;

QString default_css = "border-radius: 10px; margin:5px; background-color:white; ";
QString click_css = " border-radius: 10px; margin:5px;background-color:rgba(255,142,22,255); color: white; ";

std::mutex qt_mtx;

MainWindow::MainWindow(QWidget* parent)
	: QMainWindow(parent)
	, ui(new Ui::MainWindow)
	, font("Arial", 20)
{
	ui->setupUi(this);
	//resize(1024, 728);
	showFullScreen();

	symptom_list = { "감기","두통","근육통","구내염","설사","위염","장염","피부염" };
	
	set_slot();
	set_symptom_list();

	QString img_path = "../resource/logo1.png";		//~/S10P12A201/embedded/
	QPixmap pixmap(img_path);
	QPixmap resizemap = pixmap.scaled(150, 80, Qt::KeepAspectRatio);

	ui->logo_label->setPixmap(resizemap);

	connect(ui->symptom_button, &QPushButton::clicked, [=]() {set_symptom_list(); });
	connect(ui->bookmark_button, &QPushButton::clicked, [=]() {set_user_list(); });

	thread_app = std::thread(&MainWindow::recv_app_open, this);

	connect(this, &MainWindow::open_signal, this, &MainWindow::medicine_clicked);
	connect(this, &MainWindow::add_signal, this, &MainWindow::add_medicine);
}

MainWindow::~MainWindow()
{
	thread_app.join();
	delete ui;
}
void MainWindow::set_slot() {
	QLayoutItem* delete_item;
	while ((delete_item = ui->medicine_layout->itemAt(0)) != NULL)
		delete delete_item->widget();

	request_info(REQUEST_SLOT);

	clear_slot.clear();
	for (int i = 0; i < SLOT_MAX; i++) {
		QPushButton* button = new QPushButton("", this);

		if (!med_list_slot[i].med_exist) {
			button->setText("비어있음");
			button->setEnabled(false);
			button->setStyleSheet("QPushButton:disabled { color: gray; border-radius: 10px; background-color:white; margin:5px;}");
			
			button->setFont(font);
			valid_button[i] = false;	

		}
		else {

			QString original_string = med_list_slot[i].med_name.c_str();
			QString max_string;

			int maxLength = 9;

			if (original_string.length() > maxLength * 2) {
				max_string = original_string.left((maxLength * 2) - 2) + "...";
				max_string.insert(maxLength, QString("\n"));
			}
			else if (original_string.length() > maxLength)
				max_string = original_string.insert(maxLength, QString("\n"));
			else
				max_string = original_string;

			button->setText(max_string);
			valid_button[i] = true;
			clear_slot.push_back(i);

		}
		button->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
		ui->medicine_layout->addWidget(button, i / 2, i % 2);
		connect(button, &QPushButton::clicked, [=]() {medicine_clicked(med_list_slot[i].slot_number, med_list_slot[i].slot_id); });

		buttons[i] = button;
	}
	
	set_default(clear_slot);
}
void MainWindow::medicine_clicked(int slot_num, long long slot_id) {
	valid_app_request = false;
	request_info(REQUEST_MEDICINE, slot_id);

	QFont big_font;
	big_font.setPointSize(30);

	QDialog* dialog = new QDialog();
	QGridLayout* layout = new QGridLayout;

	QLabel* text = new QLabel("용법/용량");
	QLabel* text2 = new QLabel("주의사항");

	layout->setContentsMargins(20, 15, 20, 10);
	layout->setSpacing(20);
	layout->addWidget(text, 1, 0, Qt::AlignCenter);
	layout->addWidget(text2, 2, 0, Qt::AlignCenter);

	text->setFont(font);
	text2->setFont(font);

	text->setStyleSheet("font-weight:bold;color:#244152; background-color:white; padding: 10px; border-radius:15px");
	text2->setStyleSheet("font-weight:bold; color:#244152;  background-color:white; padding: 10px;border-radius:15px;");

	QLabel* name_label = new QLabel(medicine_info.med_name.c_str());
	name_label->setStyleSheet("font-weight:bold;color:#244152;");
	QString original_string = medicine_info.med_name.c_str();
	QString max_string;

	int maxLength = 28;

	if (original_string.length() > maxLength) {
		max_string = original_string.left(maxLength) + "...";
		name_label->setText(max_string);
	}
	QLabel* method_label = new QLabel(medicine_info.med_method.c_str());
	QLabel* warning_label = new QLabel(medicine_info.med_warning.c_str());

	method_label->setWordWrap(true);
	warning_label->setWordWrap(true);

	name_label->setFont(big_font);

	method_label->setFont(font);
	warning_label->setFont(font);

	name_label->setAlignment(Qt::AlignCenter);

	QScrollArea* method_area = new QScrollArea(this);
	method_area->setWidgetResizable(true);
	method_area->setWidget(method_label);
	method_area->setStyleSheet("background-color:white;");

	QScrollArea* warning_area = new QScrollArea(this);
	warning_area->setWidgetResizable(true);
	warning_area->setWidget(warning_label);
	warning_area->setStyleSheet("background-color:white;");

	QPushButton* button = new QPushButton("칸 닫기");
	button->setEnabled(false);
	button->setFixedSize(300, 75);
	button->setStyleSheet("font-weight:bold;border-radius: 10px; background-color:lightgray");
	button->setFont(font);
	
	//button->setEnabled(true);
	connect(button, &QPushButton::clicked, dialog, [=]() {close_window(dialog,slot_num); });

	layout->setRowStretch(1, 1);
	layout->setRowStretch(2, 1);
	layout->addWidget(name_label, 0, 0, 1, 0);
	layout->addWidget(method_area, 1, 1, 1, 7);
	layout->addWidget(warning_area, 2, 1, 1, 7);
	layout->addWidget(button, 3, 0, 1, 0, Qt::AlignCenter);

	std::thread motor_th = std::thread(&MainWindow::motor_open,this,slot_num, button);
	dialog->showFullScreen();
	dialog->setLayout(layout);
	dialog->setStyleSheet("background-color: rgba(244,181,70,255);");
	dialog->exec();
	motor_th.join();
	
	valid_app_request = true;


}
void MainWindow::motor_close(int slot_num, QDialog* dialog) {

	std::unique_lock<std::mutex> lk(mtx_slot);
	motor_slot_number = slot_num;    // 열고 닫는 칸 번호
	is_slot_open = false;    // true면 오픈 false면 close
	cv_motor.notify_one();
	cv_motor.wait(lk);

	if (dialog) {
		showFullScreen();
		dialog->accept();

	}

}
void MainWindow::motor_open(int slot_num, QPushButton* btn) {

	std::unique_lock<std::mutex> lk(mtx_slot);
	motor_slot_number = slot_num;    // 열고 닫는 칸 번호
	is_slot_open = true;    // true면 오픈 false면 close
	cv_motor.notify_one();
	cv_motor.wait(lk);
	if (btn) {
		btn->setEnabled(true);
		btn->setStyleSheet("background-color:#244152;  color:white;  ");
	}

}

void MainWindow::close_window(QDialog* dialog,int slot_num) {

	dialog->accept();

	QDialog* close_dialog = new QDialog();
	QLabel* label = new QLabel("문이 닫히고있습니다.\n잠시만 기다려주세요.");
	QVBoxLayout* layout = new QVBoxLayout();

	layout->setContentsMargins(20, 120, 20, 10);

	label->setStyleSheet("font-size:100px;color:white; font-weight:bold;");
	label->setAlignment(Qt::AlignCenter);
	layout->addWidget(label);

	close_dialog->setStyleSheet("background-color: rgba(244,181,70,255);");
	close_dialog->setLayout(layout);
	close_dialog->showFullScreen();

	std::thread motor_th = std::thread(&MainWindow::motor_close, this, slot_num, close_dialog);


	close_dialog->exec();
	motor_th.join();

}
void MainWindow::add_medicine(int slot_num,int type) {

	valid_app_request = false;

	QDialog* dialog = new QDialog();
	QVBoxLayout* layout = new QVBoxLayout;
	QLabel* text = new QLabel();
	switch (type) {
	case 0:
		text->setText("약을 넣고 \n'칸 닫기' 버튼을 \n눌러주세요.");
		break;
	case 1:
		text->setText("약을 빼고 \n'칸 닫기' 버튼을 \n눌러주세요.");
		break;
	}
	
	QPushButton* button = new QPushButton("칸 닫기");

	layout->setContentsMargins(20, 120, 20, 10);
	layout->setSpacing(10);
	layout->addWidget(text);
	layout->addWidget(button, 1, Qt::AlignCenter);

	text->setStyleSheet("font-weight:bold;color:white; padding: 10px; border-radius:15px; font-size:130px;font-weight:bold;");
	text->setAlignment(Qt::AlignCenter);

	button->setFixedSize(300, 75);
	button->setStyleSheet("background-color:lightgray; font-weight:bold;  border-radius: 10px;");
	button->setFont(font);
	button->setEnabled(false);
	connect(button, &QPushButton::clicked, dialog, [=]() {close_window(dialog,slot_num); });

	std::thread motor_th = std::thread(&MainWindow::motor_open, this,slot_num,button);

	dialog->showFullScreen();
	dialog->setLayout(layout);
	dialog->setStyleSheet("background-color: rgba(244,181,70,255);");
	dialog->exec();
	set_slot();

	motor_th.join();
        valid_app_request = true;
}

void MainWindow::set_medicine_highlight(std::vector<int>& slot_number_list) {
	set_default(clear_slot);
	for (std::vector<int>::iterator it = slot_number_list.begin(); it != slot_number_list.end(); it++) {
		int cur_number = *it;
		valid_button[cur_number] = true;
		buttons[cur_number]->setEnabled(true);
		buttons[cur_number]->setStyleSheet("font-size: 24px; font-weight: bold;background-color:rgba(245,252,173,255); color:#244152;  border-radius: 10px;margin: 5px;");
	}

}
void MainWindow::set_default(std::vector<int>& slot_number_list) {
	for (std::vector<int>::iterator it = slot_number_list.begin(); it != slot_number_list.end(); it++) {
		valid_button[*it] = true;
		buttons[*it]->setEnabled(true);
		buttons[*it]->setStyleSheet(" border-radius: 10px; background-color:white; margin:5px; font-size: 24px; ");
	}

}

void MainWindow::set_symptom_list() {
	QGridLayout* layout = NULL;

	if (cur_menu == MENU_SYMPTOM)
		layout = static_cast<QGridLayout*>(ui->main_layout->itemAt(2)->layout());
	else {
		if (cur_menu != MENU_EMPTY)
			deleteLayout(ui->main_layout->itemAt(2)->layout());

		layout = new QGridLayout();
		layout->setContentsMargins(0, 10, 0, 0);

		ui->main_layout->addLayout(layout);

		for (int i = 0; i < SLOT_MAX; i++) {
			QPushButton* button = new QPushButton(symptom_list[i].c_str(), this);
			button->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
			button->setFont(font);
			button->setStyleSheet(default_css);
			layout->addWidget(button, i / 2, i % 2);

			connect(button, &QPushButton::clicked, [=]() {symptom_clicked(i); });
		}

		cur_menu = MENU_SYMPTOM;
		cur_symptom = -1;
		set_default(clear_slot);
	}

	ui->symptom_button->setStyleSheet(click_css);
	ui->bookmark_button->setStyleSheet(default_css);
	cur_user = -1;
}

void MainWindow::symptom_clicked(int symptom_id) {

	QLayout* lay = static_cast<QGridLayout*>(ui->main_layout->itemAt(2)->layout());
	if (cur_symptom != -1)
		lay->itemAt(cur_symptom)->widget()->setStyleSheet(default_css);

	if (cur_symptom == symptom_id) {
		set_default(clear_slot);
		cur_symptom = -1;
	}
	else {

		int ret = request_info(REQUEST_SYMPTOM, symptom_id);
		mtx_read.lock();

		std::vector<int> MLS = med_list_symptom.find(ret)->second;
		med_list_symptom.erase(ret);

		mtx_read.unlock();
		lay->itemAt(symptom_id)->widget()->setStyleSheet(click_css);

		set_medicine_highlight(MLS);
		cur_symptom = symptom_id;
	}

}

void MainWindow::set_user_list() {
	QVBoxLayout* layout = NULL;
	if (cur_menu == MENU_BOOKMARK)
		layout = static_cast<QVBoxLayout*>(ui->main_layout->itemAt(2)->layout());
	else {
		if (cur_menu != MENU_EMPTY) {
			QLayoutItem* delete_layout = ui->main_layout->itemAt(2);
			deleteLayout(delete_layout->layout());
		}

		layout = new QVBoxLayout();
		QLabel* user_label = new QLabel("사용자", this);
		QGridLayout* user_list_layout = new QGridLayout();

		ui->main_layout->addLayout(layout);
		user_label->setFont(font);
		layout->addWidget(user_label);
		layout->addLayout(user_list_layout);

		int ret = request_info(REQUEST_USER);
		mtx_read.lock();
		std::vector<User> UL = user_list.find(ret)->second;
		user_list.erase(ret);
		mtx_read.unlock();

		user_list_layout->setColumnStretch(0, 1);
		user_list_layout->setColumnStretch(1, 1);
		user_list_layout->setRowStretch(0, 1);
		user_list_layout->setRowStretch(1, 1);

		for (int i = 0; i < UL.size(); i++) {
			QPushButton* button = new QPushButton(UL[i].user_name.c_str(), this);
			button->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
			user_list_layout->addWidget(button, i / 2, i % 2);
			button->setFont(font);
			button->setStyleSheet(default_css);
			connect(button, &QPushButton::clicked, [=]() {set_bookmark_list(UL[i].user_id, i); });
		}

		QLabel* bookmark_label = new QLabel("등록된 즐겨찾기", this);
		QLabel* empty_label = new QLabel("", this);
		bookmark_list_layout = new QGridLayout();

		bookmark_label->setFont(font);
		layout->addWidget(bookmark_label);

		layout->addLayout(bookmark_list_layout);
		layout->setStretch(1, 1);
		layout->setStretch(3, 1);

		empty_label->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
		bookmark_list_layout->addWidget(empty_label);

		cur_menu = MENU_BOOKMARK;
		cur_user = -1;
		cur_bookmark_order = -1;
		set_default(clear_slot);

	}

	ui->symptom_button->setStyleSheet(default_css);
	ui->bookmark_button->setStyleSheet(click_css);
}

void MainWindow::set_bookmark_list(long long user_id, int user_num) {
	QLabel* empty_label = new QLabel("", this);
	QLayout* lay = ui->main_layout->itemAt(2)->layout();
	empty_label->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);

	QLayoutItem* delete_item;
	while ((delete_item = bookmark_list_layout->itemAt(0)) != NULL)
		delete delete_item->widget();

	if (cur_user != -1)
		lay->itemAt(1)->layout()->itemAt(cur_user_num)->widget()->setStyleSheet(default_css);

	if (cur_user != user_id) {

		int ret = request_info(REQUEST_BOOKMARK, user_id);
		mtx_read.lock();
		std::vector<BookmarkByUser> BBU = bookmark_list_user.find(ret)->second;
		bookmark_list_user.erase(ret);
		mtx_read.unlock();

		bookmark_list_layout->setColumnStretch(0, 1);
		bookmark_list_layout->setColumnStretch(1, 1);
		bookmark_list_layout->setRowStretch(0, 1);
		bookmark_list_layout->setRowStretch(1, 1);
		lay->itemAt(1)->layout()->itemAt(user_num)->widget()->setStyleSheet(click_css);

		for (int i = 0; i < BBU.size(); i++) {

			QString original_string = BBU[i].med_name.c_str();
			QString max_string;

			int maxLength = 8;

			if (original_string.length() > maxLength * 2) {
				max_string = original_string.left((maxLength * 2) - 2) + "...";
				max_string.insert(maxLength, QString("\n"));
			}
			else if (original_string.length() > maxLength)
				max_string = original_string.insert(maxLength, QString("\n"));
			else
				max_string = original_string;

			QPushButton* button = new QPushButton(max_string, this);
			button->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
			bookmark_list_layout->addWidget(button, i / 2, i % 2, 1, 1);
			button->setFont(font);
			button->setStyleSheet(default_css);
			connect(button, &QPushButton::clicked, [=]() {bookmark_clicked(BBU[i]); });
		}
		cur_user = user_id;
		cur_user_num = user_num;
		if (BBU.size() == 0)
			bookmark_list_layout->addWidget(empty_label);
	}
	else {
		cur_user = -1;
		cur_user_num = -1;
		bookmark_list_layout->addWidget(empty_label);
		lay->itemAt(1)->layout()->itemAt(user_num)->widget()->setStyleSheet(default_css);
	}

	cur_bookmark_order = -1;
	set_default(clear_slot);

}

void MainWindow::bookmark_clicked(BookmarkByUser bookmark) {
	QLayout* lay = ui->main_layout->itemAt(2)->layout();
	if (cur_bookmark_order != -1)
		lay->itemAt(3)->layout()->itemAt(cur_bookmark_order)->widget()->setStyleSheet(default_css);
	if (cur_bookmark_order == bookmark.bookmark_order) {
		cur_bookmark_order = -1;
		set_default(clear_slot);
	}
	else {
		cur_bookmark_order = bookmark.bookmark_order;
		std::vector<int> v = { bookmark.slot_number };
		set_medicine_highlight(v);
		lay->itemAt(3)->layout()->itemAt(bookmark.bookmark_order)->widget()->setStyleSheet(click_css);
	}
}

int MainWindow::request_info(RequestType type, int num_id) {

	mtx_write.lock();
	int temp = ++cnt;
	Request req({ type,temp });
	request_queue.push(req);

	if (type == REQUEST_BOOKMARK)
		selected_user_id.insert({ cnt,num_id });
	else if (type == REQUEST_SYMPTOM)
		selected_symptom.insert({ cnt,symptom_list[num_id] });
	else if (type == REQUEST_MEDICINE) {
		selected_slot_id.insert({ cnt, num_id });
		selected_user_id.insert({ cnt,cur_user });
	}

	cv_write.notify_one();
	mtx_write.unlock();

	std::unique_lock<std::mutex> read_lk(mtx_read);
	if (read_check.find(temp) == read_check.end()) {
		cv_read.wait(read_lk, [&temp] {return cur_read == temp; });
		read_check.erase(temp);
	}

	return temp;
}

void MainWindow::deleteLayout(QLayout* layout) {
	QLayoutItem* item;
	QLayout* subLayout;
	QWidget* widget;
	while ((item = layout->itemAt(0)) != NULL) {
		if ((subLayout = item->layout()) != NULL) {
			deleteLayout(subLayout);
		}
		else if ((widget = item->widget()) != NULL) {
			delete widget;
		}
		else {
			delete item;
		}
	}
	delete layout;
}

void MainWindow::recv_app_open() {
	std::unique_lock<std::mutex> lk(mtx_app);

	while (true) {
		cv_app.wait(lk);

		switch (app_request) {
		case APP_REQUEST_OPEN:
			emit open_signal(app_slot_number, app_slot_id);
			break;
		case APP_REQUEST_ADD:
			emit add_signal(app_slot_number,0);

			break;
		case APP_REQUEST_DELETE:
			emit add_signal(app_slot_number,1);
			break;
			
		}
		valid_app_request = true;
		
	}
}
