FROM node:lts-alpine3.9

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD NODE_ENV=production yarn start
