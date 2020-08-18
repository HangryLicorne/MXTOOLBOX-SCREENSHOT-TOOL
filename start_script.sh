#!/bin/bash
docker stop capturemxtoolbox
docker rm capturemxtoolbox
docker rmi nightmare_helper
docker build -t nightmare_helper .
docker run -d --name capturemxtoolbox --restart unless-stopped -v /opt/capturemxtoolbox/bot/screen:/screen nightmare_helper workspace/mxToolBox_ScreenTool.js
