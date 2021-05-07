FROM node:12 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_ENV = 'production'

RUN npm run build