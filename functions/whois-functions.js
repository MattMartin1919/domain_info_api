const whois = require('whois');
const debug = require('debug')('DomainScraper:server');

/*
    Exposed functions
*/
module.exports = {
  getRegistar(websiteUrl, res) {
    whois.lookup(websiteUrl, (error, response) => {
      try {
        if (!error && response) {
          debug(response);
          const registrar = response.split('Registrar:')[1].split('\n')[0].trim();
          if (registrar !== '') {
            res.status(200).send(registrar);
          } else {
            res.status(200).send('unknown registrar');
          }
        } else {
          debug(error);
          res.status(500).send('website returned a non 200 response');
        }
      } catch {
        res.status(200).send('unknown registrar');
      }
    });
  },
  getCompanyName(websiteUrl, res) {
    whois.lookup(websiteUrl, (error, response) => {
      try {
        if (!error && response) {
          debug(response);
          const companyName = response.split('Registrant Organization:')[1].split('\n')[0].trim();
          if (companyName !== '') {
            res.status(200).send(companyName);
          } else {
            res.status(200).send('unknown company name');
          }
        } else {
          res.status(500).send('website returned a non 200 response');
        }
      } catch {
        res.status(500).send('internal error');
      }
    });
  },
};
