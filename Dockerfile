FROM node
COPY . /project
WORKDIR /project
RUN npm i
