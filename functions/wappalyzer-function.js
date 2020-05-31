const Wappalyzer = require('wappalyzer');
const { load } = require('cheerio');
const normalizeUrl = require('normalize-url');
const debug = require('debug')('domain-scraper:server');

// Social media platforms
const socialNetworksObject = {
  socialNetworks: [
    'facebook',
    'twitter',
    'linkedin',
    'pinterest',
    'tumblr',
    'soundcloud',
    'instagram',
    'youtube',
    'snapchat',
  ],
};

// Youtube regex
const CUSTOM_REGEX = {
  youtube: '(channel/([\\w|@|-]+?)(?:/videos)?/?$|user?/([\\w|@|-]+)/?$)',
};

// Social media handle from url
const getHandleFromURL = (url, customRegex = null) => {
  try {
    const path = new URL(url).pathname;
    const regex = customRegex
      ? new RegExp(customRegex, 'i')
      : new RegExp('/([\\w|@|-]+)/?$', 'i');
    const match = regex.exec(path);
    return customRegex
      // eslint-disable-next-line no-shadow
      ? match.find((match, index) => index > 1 && match !== undefined)
      : match[1];
  } catch (error) {
    // Unable to parse handle, return empty value
    return '';
  }
};

// Social media parse html
const parseSocialMedia = (base) => ($) => {
  const handles = [];
  $(`a[href*="${base}."]`).each((index, elem) => {
    const url = elem.attribs.href;
    const handle = url ? getHandleFromURL(url, CUSTOM_REGEX[base] || '') : '';
    handles.push(handle);
  });
  return handles.filter(
    (handle, index) => index === handles.indexOf(handle) && handle,
  );
};

function getSocialMedia(html) {
  try {
    const $ = load(html);
    const handles = {};
    socialNetworksObject.socialNetworks.forEach((socialNetwork) => {
      handles[socialNetwork] = parseSocialMedia(socialNetwork)($);
    });
    return handles;
  } catch (error) {
    debug(`error getting social media links. error was ${error}`);
    return null;
  }
}

// Organized the raw data into an easy to store object
function decodeJson(applicationData, domainName, statusCode, socialMediaLinks) {
  try {
    const filteredData = {};
    if (applicationData.length > 0) {
      for (let y = 0; y < applicationData.length; y += 1) {
        const applicationName = applicationData[y].name;
        const applicationConfidence = applicationData[y].confidence;
        const applicationCategories = applicationData[y].categories;
        if (applicationConfidence >= 50) {
          if (applicationCategories) {
            for (let x = 0; x < applicationCategories.length; x += 1) {
              const appCategoryIter = applicationCategories[x];
              const applicationCategoryName = appCategoryIter[Object.keys(appCategoryIter)[0]];
              if (!filteredData[applicationCategoryName]) {
                filteredData[applicationCategoryName] = [];
              }
              filteredData[applicationCategoryName].push(applicationName);
            }
          }
        }
      }
    }
    return {
      domain: domainName.replace('http://', ''),
      status_code: statusCode,
      data: filteredData,
      social_media: socialMediaLinks,
    };
  } catch (error) {
    debug(error);
    return {
      domain: domainName.replace('http://', ''),
      status_code: statusCode,
      data: {},
      social_media: {},
    };
  }
}

// Wappalyzer search params
const wappalyserOptions = {
  debug: false,
  delay: 300,
  maxDepth: 3,
  maxUrls: 5,
  maxWait: 10000,
  recursive: true,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  htmlMaxCols: 2000,
  htmlMaxRows: 3000,
};

/*
    Exposed functions
*/
module.exports = {
  runWappalyzer(url, res) {
    // Add a protocol to the url
    const normalizedUrl = normalizeUrl(url);
    const wappalyzer = new Wappalyzer(normalizedUrl, wappalyserOptions);

    // Scrape for social media links ( TO DO: ai for vertical classification?)
    let socialMediaLinks = {};
    wappalyzer.on('visit', (params) => {
      try {
        const {
          browser,
        } = params;
        socialMediaLinks = getSocialMedia(browser.html);
        return;
      } catch (error) {
        debug(`error getting social stuff from ${url} error was ${error}`);
      }
    });

    // Analyze the results then return formatted JSON as return.
    wappalyzer.analyze()
      .then((data) => {
        if (data == null) {
          res.status(500).send('internal server error');
        }
        const domainName = Object.keys(data.urls)[0];
        const statusCode = data.urls[domainName].status;
        switch (statusCode) {
          case 200:
            res.status(200).send(decodeJson(
              data.applications,
              normalizedUrl,
              statusCode,
              socialMediaLinks,
            ));
            break;
          case 0:
            res.status(500).send('domain can not be crawled');
            break;
          default:
            res.status(500).send('internal server error');
            break;
        }
      })
      .catch((error) => {
        debug(error);
        res.status(500).send('did you input a valid domain?');
      });
  },
};
