FROM node:10.16.2-alpine
RUN apk --no-cache add git python make g++

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Running required steps to prepare the api prod build
RUN npm i
RUN npm run build
RUN cd build/src/utils/ && node userHelper.js --create user --role SP --name user-SP-1-cloud --location 52.507339,13.377985 --paymentQueue true

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++

EXPOSE 4000:4000

# Serve the prod build from the dist folder
CMD ["node", "./build/src/index"]