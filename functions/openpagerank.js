const axios = require('axios');
const debug = require('debug')('DomainScraper:server');

// declare axios headers
const headers = {
  'API-OPR': process.env.OPEN_PAGE_RANK_KEY,
  Accept: 'application/x-www-form-urlencoded',
  'Content-Type': 'application/x-www-form-urlencoded',
};
/*
    Exposed functions
*/
module.exports = {
  /**
   * Get a websites page rank from OpenPageRank
   */
  runPageRank(validUrls, invalidUrls, res) {
    try {
      const queryParam = { domains: validUrls };
      axios.get('https://openpagerank.com/api/v1.0/getPageRank', {
        params: queryParam,
        headers,
      })
        .then((request) => {
          res.status(200).send({
            data: {
              valid_domains: request.data.response,
              invalid_domains: invalidUrls,
            },
          });
        })
        .catch((error) => {
          debug(error);
          res.status(500).send('error retrieving page rank');
        });
    } catch (error) {
      debug(error);
      res.status(500).send('internal error with page rank function');
    }
  },
};
