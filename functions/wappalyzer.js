/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const normalizeUrl = require('normalize-url');
const debug = require('debug')('DomainScraper:wappalyzer');

// process.setMaxListeners(0);

// Organized the raw data into an easy to store object
async function decodeJson(applicationData, domainName, statusCode) {
  try {
    const filteredData = {};
    if (applicationData && applicationData.length > 0) {
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

/*
    Exposed functions
*/
module.exports = {
  async runWappalyzer(wappalyzer, url, res) {
    try {
      // Add a protocol to the url
      const normalizedUrl = normalizeUrl(url);
      wappalyzer.open(normalizedUrl).analyze()
        .then(async (results) => {
          let statusCode;
          for (const x in results.urls) {
            statusCode = results.urls[x].status;
          }
          res.status(200).send(await decodeJson(
            results.technologies,
            normalizedUrl,
            statusCode,
          ));
        })
        .catch((error) => {
          debug(error);
          res.status(500).send('Something went wrong analyzing the results...');
        });
    } catch (error) {
      // await wappalyzer.destroy();
      debug(error);
      res.status(500).send('Something went wrong getting the website data...');
    }
  },
};
