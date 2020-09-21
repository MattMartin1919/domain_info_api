const dns = require('dns');
const debug = require('debug')('DomainScraper:server');
/*
    Exposed functions
*/
module.exports = {
  getAllInfo(url, res) {
    dns.resolveAny(url, (error, addresses) => {
      if (!error && addresses) {
        res.status(200).send({ data: { addresses } });
      } else if (error && error.code === 'ENODATA') {
        res.status(200).send('no data');
      } else {
        debug(error);
        res.status(500).send('website returned a non 200 response');
      }
    });
  },
};
