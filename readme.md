# Welcome to the Domain Info API!

## What this tool does:
Provides an API that can check any domain for technologies being used, open page rank, dns entries and social media links.

## Install:
1. `git clone https://github.com/MattMartin1919/domain_info_api.git`
2. `cd domain_info_api`
3. `npm install`

### Run in dev mode (hot reload)
1. `npm run dev`
2. Visit localhost:3000 for the swagger UI

### Run in prod mode
1. `npm start`
2. Visit localhost:3000 for the swagger UI

### Run in pm2 cluster mode
1. `NODE_ENV=production pm2 start ecosystem.config.js`
2. Visit localhost:3000 for the swagger UI

### Run using docker
1. `docker run -e OPEN_PAGE_RANK_KEY=XXXXX  -p 127.0.0.1:3000:3000 --cpus 2 --restart on-failure -d --name domain_info_api matt1919/domain_info_api`
2. Visit localhost:3000 for the swagger UI

**You do not need to specify an open page rank key but you will be unable to use the endpoint until you do**



## Credits
Wappalyzer - https://github.com/AliasIO/Wappalyzer

social-media-scraper - https://github.com/tryolabs/social-media-scraper

Open PageRank - https://www.domcop.com/openpagerank/what-is-openpagerank
