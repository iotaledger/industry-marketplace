FROM node:10.13.0-alpine
RUN apk --no-cache add git python make g++

RUN echo "Dockerfile called"
ENV GITHUB_TOKEN=XXXXX

RUN git config --global url."https://${GITHUB_TOKEN}:@github.com/".insteadOf "https://github.com/"

RUN git clone --branch Simulation https://github.com/iotaledger/industry-marketplace.git /usr/src/

# Working DIR
WORKDIR /usr/src/ServiceApp/server

# Running required steps to prepare the api prod build
RUN npm install
RUN npm run build
RUN cd build/src/utils/ && node userHelper.js --create user --role SR --name simSR1 --location 52.507339,13.377982  && node userHelper.js --create wallet
RUN cd build/src/utils/ && node userHelper.js --create user --role SR --name simSR2  --location 52.507339,13.377982  && node userHelper.js --create wallet
RUN cd build/src/utils/ && node userHelper.js --create user --role SR --name simSR3  --location 52.507339,13.377982  && node userHelper.js --create wallet
RUN cd build/src/utils/ && node userHelper.js --create user --role SR --name simSR4  --location 52.507339,13.377982  && node userHelper.js --create wallet
RUN cd build/src/utils/ && node userHelper.js --create wallet
RUN cd build/src/utils/ && node userHelper.js --create wallet
RUN cd build/src/utils/ && node userHelper.js --create wallet

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++

EXPOSE 5000:5000

# Serve the prod build from the dist folder
CMD ["node", "./build/src/index"] 

