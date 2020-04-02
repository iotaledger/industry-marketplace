FROM ubuntu:16.04
FROM node:10.13.0-alpine
RUN apk --no-cache add git python make g++

# Working DIR
WORKDIR /usr/src/ServiceApp/server

#Copy files
COPY . . 

# Running required steps to prepare the api prod build
ENV PORT 4300
ENV PROVIDER http://localhost:14265
RUN yarn 
RUN yarn build

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++
RUN chmod +x /usr/src/ServiceApp/server/scripts/startMarketManager.sh
