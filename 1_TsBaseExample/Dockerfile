# syntax=docker/dockerfile:experimental
ARG COMMIT

#pull node dependencies
FROM ubuntu:18.04 as dependencies

RUN apt-get update && \
    apt-get install -y \
    git \
    ssh \
    curl

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

WORKDIR /home/app/

RUN mkdir -p -m 0600 ~/.ssh/ && \
    ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts

COPY . .
RUN --mount=type=ssh npm install
RUN npm run tsc
RUN npm prune --production

FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y \
    sqlite3 \
    curl

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

WORKDIR /home/app/

COPY --from=dependencies /home/app/build ./build
COPY --from=dependencies /home/app/package*.json ./
COPY --from=dependencies /home/app/node_modules ./node_modules

COPY api api

ARG COMMIT
LABEL commit=${COMMIT}

ENV NODE_ENV production
CMD ["node", "/home/app/build/index.js"]