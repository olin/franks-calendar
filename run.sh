#!/bin/bash
app="franks-calendar"
docker build -t ${app} .
docker run -d -p 56733:5000 \
    --name=${app} \
    -v $PWD:/app jackgreenberg/${app}
