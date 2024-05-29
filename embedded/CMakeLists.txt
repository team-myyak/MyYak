cmake_minimum_required(VERSION 3.5)

project(
		embedded LANGUAGES CXX
	   )

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(
		${CMAKE_SOURCE_DIR}
		${CMAKE_SOURCE_DIR}/includes
		)

link_directories(
		${CMAKE_SOURCE_DIR}/includes
		)

find_package(Qt5 COMPONENTS Widgets REQUIRED)

add_executable(
		program
		main.cpp
		qtmain.cpp
		serial.cpp
		motor.cpp
		common.cpp
		mainwindow.cpp
		mainwindow.h
		mainwindow.ui
		)

target_link_libraries(
		program
		PUBLIC pthread
		PUBLIC wiringPi
		PRIVATE Qt5::Widgets
		PUBLIC ${CMAKE_SOURCE_DIR}/includes/libjsoncpp.a
		)
