FROM node:20 AS builder

WORKDIR /app

ADD . /app

RUN yarn install --immutable

RUN yarn prisma generate --schema="./bridge/prisma/schema.prisma"

RUN yarn build

CMD yarn start:prod
