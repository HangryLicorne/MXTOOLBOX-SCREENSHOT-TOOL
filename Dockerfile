FROM quay.io/ivanvanderbyl/docker-nightmare:latest
MAINTAINER "Ivan Vanderbyl <ivan@flood.io>"

ADD . /workspace
RUN yarn install
RUN npm i nightmare-screenshot-selector
RUN npm i prompt-sync

RUN mkdir /screen

CMD "mxToolBox_ScreenTool.js"
