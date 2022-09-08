FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY dist dist

CMD [ "npm", "run", "start" ]
