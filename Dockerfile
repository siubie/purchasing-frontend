FROM docker.io/node:latest

RUN mkdir -p /root/html

WORKDIR /root/html

RUN apt-get update
RUN apt-get -y upgrade
RUN npm install -g bower http-server

ADD . /root/html

RUN bower update --allow-root

EXPOSE 80

CMD ["-p 80"]

ENTRYPOINT /usr/local/bin/http-server
