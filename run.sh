#!/bin/bash
cd ./frontend
yarn run webpack
cd ../backend
python ./app.py