const { Resolver } = require('dns');

const resolver = new Resolver();
resolver.setServers(['8.8.8.8']);
const debug = require('debug')('DomainScraper:dns');
/*
    Exposed functions
*/
module.exports = {
  getAllInfo(url, res) {
    resolver.resolveAny(url, (error, addresses) => {
      try {
        debug(error);
        if (!error && addresses) {
          res.status(200).send({ data: { addresses } });
        } else if (error && error.code === 'ENODATA') {
          res.status(200).send('no data');
        } else {
          debug(error);
          res.status(422).send('website returned a non 200 response');
        }
      } catch (err) {
        debug(err);
        res.status(500).send('Something odd happened while getting your data...');
      }
    });
  },
};
