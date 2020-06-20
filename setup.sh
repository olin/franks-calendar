#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Setting up Frank's Calendar..."

read -p "Enter your Sendgrid API key: " API_KEY
if [ "$API_KEY" = "" ]; then
    echo -e "${RED}WARNING: No API key entered.${NC} Something might break..."
else
    echo $API_KEY > .sendgrid.env
fi

echo "Setting up docker containers..."
docker-compose up -d

echo "Ingesting mock events from events.json..."
docker exec -ti franks-calendar-database \
    mongoimport --db=calendar-dev --collection=events \
    --authenticationDatabase=calendar-dev --username=frank \
    --password=calendar --drop --file ./events.json

echo -e "${GREEN}Done!${NC}"
