#!/bin/bash
sudo systemctl restart nginx
cd /var/www/yohoho/
git pull
cd /var/www/yohoho/frontend
yarn webpack
python3 /var/www/yohoho/backend/app.py
