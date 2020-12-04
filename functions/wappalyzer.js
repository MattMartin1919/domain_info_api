/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const Wappalyzer = require('wappalyzer');
const normalizeUrl = require('normalize-url');
const debug = require('debug')('DomainScraper:wappalyzer');

process.setMaxListeners(0);

// Organized the raw data into an easy to store object
function decodeJson(applicationData, domainName, statusCode) {
  try {
    const filteredData = {};
    if (applicationData.length > 0) {
      for (let y = 0; y < applicationData.length; y += 1) {
        const applicationCategories = applicationData[y].categories;
        // only return if application confidence is greater than 50%
        if (applicationData[y].confidence >= 50 && applicationCategories) {
          for (const x in applicationCategories) {
            const categoryName = applicationCategories[x].name;
            // if a key's array does not exist, make it
            filteredData[categoryName] = filteredData[categoryName] || [];
            // add the application name to the category
            filteredData[categoryName].push(applicationData[y].name);
          }
        }
      }
    }
    return {
      domain: domainName.replace('http://', ''),
      status_code: statusCode,
      data: filteredData,
    };
  } catch (error) {
    debug(error);
    return {
      domain: domainName.replace('http://', ''),
      status_code: statusCode,
      data: {},
    };
  }
}

// Wappalyzer search params
const options = {
  debug: false,
  delay: 500,
  maxDepth: 3,
  maxUrls: 3,
  maxWait: 30000,
  recursive: true,
  probe: true,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
};

/*
    Exposed functions
*/
module.exports = {
  async runWappalyzer(url, res) {
    // Add a protocol to the url
    const normalizedUrl = normalizeUrl(url);
    const wappalyzer = new Wappalyzer(options);

    try {
      await wappalyzer.init();
      const site = await wappalyzer.open(normalizedUrl);
      const results = await site.analyze();
      let statusCode;
      for (const x in results.urls) {
        statusCode = results.urls[x].status;
      }
      await wappalyzer.destroy();
      res.status(200).send(decodeJson(
        results.technologies,
        normalizedUrl,
        statusCode,
      ));
    } catch (error) {
      await wappalyzer.destroy();
      debug(error);
      res.status(422).send('did you input a valid domain?');
    }
  },
};
