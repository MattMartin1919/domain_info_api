const axios = require('axios');
const { load } = require('cheerio');
const normalizeUrl = require('normalize-url');
const debug = require('debug')('DomainScraper:socialmedia');

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
    debug(error);
    return null;
  }
}

/*
    Exposed functions
*/
module.exports = {
  GetAccounts(url, res) {
    // Add a protocol to the url
    const normalizedUrl = normalizeUrl(url);

    // Scrape for social media links
    let socialMediaLinks = {};
    try {
      axios.get(normalizedUrl)
        .then((request) => {
          socialMediaLinks = getSocialMedia(request.data);
          res.status(200).send({
            data: socialMediaLinks,
          });
        })
        .catch((error) => {
          debug(error);
          res.status(422).send('Error getting social media');
        });
    } catch (err) {
      debug(err);
      res.status(500).send('Something odd happened while getting your data...');
    }
  },
};
