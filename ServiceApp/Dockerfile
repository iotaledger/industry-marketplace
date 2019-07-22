FROM node:8.16.0-alpine
RUN apk --no-cache add git

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Running required steps to prepare the app prod build
RUN npm install
RUN npm install -g serve
RUN npm run build

# Remove all the node_modules so the docker image doesn't exceeds max size
RUN apk del git
RUN rm -rf node_modules

EXPOSE 4001:4001

# Serve the prod build from the build folder
CMD ["serve", "-s", "build", "-p", "4001"]