#!/usr/bin/env bash

docker run -d -p 80:80 -e PROFILE=development -e CONFIG_SERVER_LABEL=master <%= imageName %>