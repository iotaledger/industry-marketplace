FROM node:10.13.0-alpine
RUN apk --no-cache add git python make g++

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Set the env variables
ARG CONFIG_ID
RUN echo "CONFIG_ID=$CONFIG_ID"

# Running required steps to prepare the api prod build
RUN npm install
RUN npm run build

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++

EXPOSE 4000:4000

# Serve the prod build from the dist folder
CMD ["node", "./dist/index"]