#!/bin/sh

# Start environment
cd one-command-tangle/

sudo docker-compose -p privateTangle -f docker-compose.yml up -d
sudo docker-compose -p tools -f docker-compose-tools.yml up -d 

cd ../ServiceApp/server/

sudo docker-compose -p environment -f docker-compose-sim.yml up