#!/usr/bin/env bash

echo 'tagging image with registry info'
docker tag <%= imageName %>:latest <%= registry %>/<%= imageName %>:latest

echo 'pushing image to the registry'
docker push <%= registry %>/<%= imageName %>:latest
