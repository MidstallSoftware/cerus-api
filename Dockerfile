FROM node:16-alpine

RUN apk update && apk upgrade
RUN apk add git python3 make build-base && ln -sf python3 /usr/bin/python

RUN rm -rf /usr/src/server
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server

COPY . /usr/src/server/
RUN npm install && npm run build && npm prune --production && rm -rf src

EXPOSE 8080
CMD ["npm", "start"]