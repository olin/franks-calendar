FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7
# MAINTAINER Jack Greenberg "jgreenberg@olin.edu"
# RUN apt-get update -y && \
    # apt-get install -y python-pip python-dev
RUN apk --update add bash vim gcc g++ libxslt-dev nodejs
COPY ./requirements.txt /app/requirements.txt
COPY ./package.json /app/package.json
WORKDIR /app
RUN pip install -r requirements.txt
RUN npm install
COPY . /app
EXPOSE 5000
CMD npm run serve
