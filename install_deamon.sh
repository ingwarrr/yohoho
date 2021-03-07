#!/bin/bash
sudo chmod 744 /var/www/yohoho/run.sh
cp run_flask.service /etc/systemd/system/
sudo chmod 664 /etc/systemd/system/run_flask.service

sudo systemctl daemon-reload
sudo systemctl enable run_flask.service