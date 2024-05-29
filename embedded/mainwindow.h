#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <vector>
#include <QPushButton>
#include <iostream>
#include <QGridLayout>
#include <QWidget>
#include <QLabel>
#include <QString>
#include <QDialog>
#include <QFont>
#include <QScrollArea>
#include <QDesktopWidget>
#include <QFrame>
#include <QPixmap>
#include <QVBoxLayout>
#include <QTimer>
#include<thread>
#include "common.hpp"

#define SLOT_MAX 8

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    QFont font;
private:
    Ui::MainWindow *ui;
	std::thread thread_app;

    void medicine_clicked(int slot_num, long long slot_id);
    void set_medicine_highlight(std::vector<int>& slot_number_list);
    void set_default(std::vector<int>& slot_number_list);
    void symptom_clicked(int symptom_id);
    void set_symptom_list();
    void set_user_list();
    void set_bookmark_list(long long user_id,int user_num);
    void bookmark_clicked(BookmarkByUser bookmark);
    int request_info(RequestType type, int num_id=0);
    void deleteLayout(QLayout* layout);
    void close_window(QDialog * dialog,int slot_num);
    void motor_open(int slot_num, QPushButton* btn=NULL);
    void motor_close(int slot_num,QDialog* dialog=NULL);
    void recv_app_open();
    void add_medicine(int slot_num, int type);
    void set_slot();

signals:
	void open_signal(int, long long);
	void add_signal(int, int);
};
#endif // MAINWINDOW_H
