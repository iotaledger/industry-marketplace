FROM node:8.16.0-alpine
RUN apk --no-cache add git python make g++

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Running required steps to prepare the api prod build
RUN npm install
RUN npm run build
RUN cd build/src/utils/ && node userHelper.js --create user --role SP --id user-SP-cloud --areaCode MLQMUFLV9TO && node userHelper.js --create wallet

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++

EXPOSE 4000:4000

# Serve the prod build from the dist folder
CMD ["node", "./build/src/index"]