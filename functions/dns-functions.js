const dns = require('dns');
const debug = require('debug')('DomainScraper:server');
/*
    Exposed functions
*/
module.exports = {
  /**
   * Get the name server info about a domain
   */
  getNSInfo(url, res) {
    try {
      dns.resolveNs(url, (error, addresses) => {
        if (!error && addresses) {
          res.status(200).send({ data: { addresses } });
        } else {
          debug(error);
          res.status(500).send('website returned a non 200 response');
        }
      });
    } catch (error) {
      debug(error);
      res.status(500).send('error with the dns package');
    }
  },
  /**
   * Get the cname info about a sub-domain
   */
  getCNAMEInfo(url, res) {
    try {
      dns.resolveCname(url, (err, addresses) => {
        if (!err && addresses) {
          res.status(200).send({ data: { addresses } });
        } else if (err && err.code === 'ENODATA') {
          res.status(500).send('no cname data');
        } else {
          res.status(500).send('website returned a non 200 response');
        }
      });
    } catch (err) {
      debug(err);
      res.status(500).send('error with the dns package');
    }
  },
};
