#!/bin/bash
sudo systemctl restart nginx
cd /var/www/yohoho/
git pull
cd ./frontend
yarn webpack
cd ../backend
python ./app.py
