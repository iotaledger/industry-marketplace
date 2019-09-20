FROM node:8.16.0-alpine
RUN apk --no-cache add git python make g++

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Running required steps to prepare the api prod build
RUN yarn
RUN yarn build

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++

EXPOSE 5000

# Serve the prod build from the dist folder
CMD ["node", "./build/src/index"]
