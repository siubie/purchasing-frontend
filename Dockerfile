FROM docker.io/node:latest

RUN mkdir -p /root/app

WORKDIR /root/app

RUN apt-get update
RUN apt-get -y upgrade
RUN npm install -g bower http-server

ADD . /root/app

RUN bower update --allow-root

EXPOSE 80

CMD "/usr/local/bin/http-server" "-p" "80"
