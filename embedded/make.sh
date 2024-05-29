#!bin/bash

sudo apt install build-essential -y
sudo apt install gcc g++ cmake -y
sudo apt-get install wiringpi libwiringpi-dev -y
sudo apt install qtbase5-dev qtchooser qt5-qmake qtbase5-dev-tools -y
sudo apt install fonts-nanum -y

cmake -DCMAKE_BUILD_TYPE=Release -DJSONCPP_WITH_CMAKE_PACKAGE=ON -S jsoncpp/ -B jsoncpp/build
cmake --build jsoncpp/build
cp jsoncpp/build/lib/libjsoncpp.a includes/

cmake -B build
cmake --build build
