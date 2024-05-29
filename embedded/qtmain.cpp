#include "qtmain.hpp"

void make_window(){
	int argc = 1;
	char **argv = NULL;
	QApplication a(argc, argv);
	MainWindow w;


	w.show();
	a.exec();
}
