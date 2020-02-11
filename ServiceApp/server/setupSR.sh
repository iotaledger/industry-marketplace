#!/bin/bash
 node ./build/src/utils/userHelper.js --create user --role SR --name SR1  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create user --role SR --name SR2  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create user --role SR --name SR3  --location 52.507339,13.377982 &&
 node ./build/src/utils/userHelper.js --create wallet &&
 node ./build/src/utils/simulationHelper.js --simulate --role SR