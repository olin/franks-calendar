FROM node:alpine
RUN apk add --no-cache \
    python3-dev \
    gcc \
    libc-dev

RUN mkdir /www
WORKDIR /www

COPY package.json .
COPY requirements.txt .

EXPOSE 5000

ENV FLASK_ENV development

# RUN npm install
RUN pip3 install -r requirements.txt

ENTRYPOINT npm install && npm run serve
