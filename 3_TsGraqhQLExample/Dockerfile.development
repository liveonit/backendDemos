FROM node:16-alpine

# Create app directory
RUN mkdir -p /api

WORKDIR /api

COPY package.json package.json

COPY yarn.lock yarn.lock

RUN yarn install

COPY ./ /api

CMD [ "yarn", "development" ]
