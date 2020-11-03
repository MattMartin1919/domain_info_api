const whois = require('whois');
const debug = require('debug')('DomainScraper:whois');

// Helper function
async function grabItem(item, response) {
  debug(response);
  // break each line up
  const lines = response.split('\n');
  // if the first line returns the below, there will be no data
  if (lines[0].includes('No match for domain')) {
    return 'domain is not valid';
  }
  for (let x = 0; x < lines.length; x += 1) {
    // if there is a break in the lines, that means the data part is done
    if (lines[x] === '') {
      break;
    }
    // if the line includes the item passed, clean the line and return the value
    if (lines[x].includes(item)) {
      lines[x] = lines[x].split(': ');
      lines[x][1] = lines[x][1].trim();
      return lines[x][1] !== '' ? lines[x][1] : 'unknown';
    }
  }
  return 'unknown';
}

/*
    Exposed functions
*/
module.exports = {
  getRegistar(websiteUrl, res) {
    whois.lookup(websiteUrl, (error, response) => {
      if (!error && response) {
        debug(response);
        grabItem('Registrar:', response)
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            debug(err);
            res.status(500).send('error parsing the whois data');
          });
      } else {
        debug(error);
        res.status(500).send('website returned a non 200 response');
      }
    });
  },
  getCompanyName(websiteUrl, res) {
    whois.lookup(websiteUrl, (error, response) => {
      if (!error && response) {
        debug(response);
        grabItem('Registrant Organization:', response)
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            debug(err);
            res.status(500).send('error parsing the whois data');
          });
      } else {
        res.status(500).send('website returned a non 200 response');
      }
    });
  },
};
