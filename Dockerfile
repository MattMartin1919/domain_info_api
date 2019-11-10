FROM ubuntu 
MAINTAINER Matt

RUN apt-get update 
RUN apt-get install
RUN apt-get dist-upgrade -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y
COPY . /home/DomainDataApi
WORKDIR /home/DomainDataApi/
RUN npm install
CMD npm start
EXPOSE 3000