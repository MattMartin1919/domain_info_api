FROM node:12-alpine

ENV WAPPALYZER_ROOT /opt/domain_info_api
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_BIN /usr/bin/chromium-browser

RUN apk update && apk add -u --no-cache \
    nodejs \
    chromium \
    git

RUN mkdir -p "$WAPPALYZER_ROOT/browsers"

WORKDIR "$WAPPALYZER_ROOT"

ADD ./bin ./bin
ADD ./functions ./functions
ADD ./.env.example ./.env
ADD ./app.js ./app.js
ADD ./ecosystem.config.js ./ecosystem.config.js
ADD ./package.json ./package.json
ADD ./swagger.json ./swagger.json

RUN npm install

ENTRYPOINT ["node", "./bin/www"]