#!/bin/bash
 node ./build/src/utils/userHelper.js --create user --role SP --name SP1  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create user --role SP --name SP2  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create user --role SP --name SP3  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create wallet &&
 node ./build/src/utils/simulationHelper.js --simulate --role SP