#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE=$(printf '\033[34m')
WHITE=$(printf '\033[97m')
BOLD=$(printf '\033[1m')
NC='\033[0m'

printf "📅 Setting up Frank's Calendar...\n"
sleep .1

if test -f ".sendgrid.env"; then
    printf "🔑 Found sendgrid api key.\n"
    sleep .1
else
    read -p "🔑 Enter your Sendgrid API key (press enter to leave blank): " API_KEY
    if [ "$API_KEY" = ""]; then
        printf "\n⚠️ ${RED}WARNING: No API key entered.${NC} Something might break...\n"
    else
        printf "API_KEY=$API_KEY" > .sendgrid.env
    fi
fi

printf "🐋 Setting up docker containers...\n\n"

docker-compose up -d;

printf '\n'
printf '%s                      ##        .            \n' $BLUE
printf '%s                ## ## ##       ==            \n' $BLUE
printf '%s             ## ## ## ##      ===            \n' $BLUE
printf '%s         /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\___/ ===        \n' $BLUE
printf '%s    ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~   \n' $BLUE
printf '%s         \______%s o %s         __/            \n' $BLUE $WHITE $BLUE
printf '%s           \    \        __/             \n' $BLUE
printf '%s            \____\______/                \n' $BLUE
printf '%s    \n' $BLUE
printf '%s%s             |          |\n' $WHITE $BOLD
printf '%s%s          __ |  __   __ | _  __   _\n' $WHITE $BOLD
printf '%s%s         /  \| /  \ /   |/  / _\ | \n' $WHITE $BOLD
printf '%s%s         \__/| \__/ \__ |\_ \__  |\n\n' $WHITE $BOLD
printf "${NC}"

printf "🐋 Docker containers set up!\n\n"
sleep .1

printf "📦 Ingesting mock events from events.json...\n"
docker exec -ti franks-calendar-database \
    mongoimport --db=calendar-dev --collection=events \
    --authenticationDatabase=calendar-dev --username=frank \
    --password=calendar --drop --file ./events.json > mongo.log

printf "🐍 Adding additional Python libraries...\n"
docker exec -ti franks-calendar-web pip3 install Flask-WTF > /dev/null
sleep .1

printf "✅ ${GREEN}Done!${NC}\n\n"
printf "🌐 ${BOLD}Navigate to http://localhost:5000 to view the page.${NC}\n"
