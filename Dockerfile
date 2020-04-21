FROM node:10.13.0-alpine
RUN apk --no-cache add git python make g++

ENV GITHUB_TOKEN=XXXXXXXXXXXXX

RUN git config --global url."https://${GITHUB_TOKEN}:@github.com/".insteadOf "https://github.com/"

RUN git clone https://github.com/iotaledger/industry-marketplace.git /usr/src/

# Working DIR
WORKDIR /usr/src/ServiceApp/server

# Running required steps to prepare the api prod build
RUN npm install
RUN npm run build
RUN cd build/src/utils/ && node userHelper.js --create user --role SP --name user-SP-cloud --location 52.507339,13.377982
# && node userHelper.js --create wallet

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++

EXPOSE 4000

# Serve the prod build from the dist folder
CMD ["node", "./build/src/index"]