#!/bin/bash
 node ./build/src/utils/userHelper.js --create user --role SR --name simSR1  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create user --role SR --name simSR2  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create user --role SR --name simSR3  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create wallet &&
 node ./build/src/utils/simulationHelper.js --simulate --role SR --port 5000