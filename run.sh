#!/bin/bash
sudo systemctl restart nginx
git pull
cd ./frontend
yarn webpack
cd ../backend
python ./app.py
