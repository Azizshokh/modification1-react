#!/bin/bash

# PRODUCTION
git reset --hard
git checkout master
git pull origin master

npm i yarn -g
yarn global add serve
yarn
export REACT_APP_API_URL=http://159.223.189.141
yarn run build
pm2 start "yarn run start:prod" --name=PetFood-REACT
