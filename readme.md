# Welcome to the DomainScraper!

## What this tool does:
Currently this tool checks any domain for technologies being used and social media links.

WIP: dns entries, financial information (if available) and the vertical cassification. 

## How to run:
### Docker:
1) '''git clone https://github.com/MattMartin1919/DomainDataApi'''
2) '''cd DomainDataApi'''
3) '''sudo docker build -t domaindataapi .'''
4) '''sudo docker run -p 3000:3000 -d  domaindataapi'''
5) Visit #host-ip#:3000 for the swagger UI

### npm
1) '''git clone https://github.com/MattMartin1919/DomainDataApi'''
2) '''cd DomainDataApi'''
3) '''npm install'''
4) '''npm start'''
5) Visit #host-ip#:3000 for the swagger UI

## Misc stuff
### Extra docker instructions
Pause the program: 
- '''sudo docker ps -as''' -> Checks docker for all containers
- '''sudo docker pause #container id#''' -> pauses the container id

Restart the program after pausing:
- '''sudo docker ps -as''' -> Checks docker for all containers
- '''sudo docker unpause #container id#''' -> unpauses the container id

Restarts the program after quiting:
- '''sudo docker ps -as''' -> Checks docker for all containers
- '''sudo docker start #container id#''' -> starts back up the container id

Look at last 20 lines of output from docker shell:
- '''sudo docker logs #container id#'''

Follow output from docker shell:
- '''sudo docker logs --follow #container id#'''

### Extra npm stuff
Use nodemon for development: 
- '''nodemon start''' -> auto reloads the api when file is changed

## Requirements:
1) Linux
4) docker

## Credits
Wappalyzer - https://github.com/AliasIO/Wappalyzer - Awesome project to discover the technologies used on a website
social-media-scraper - https://github.com/tryolabs/social-media-scraper - Awesome tool to get the social media links from a website
Open PageRank - https://www.domcop.com/openpagerank/what-is-openpagerank - Great free page rank tool
