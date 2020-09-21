require('dotenv').config();
const express = require('express');
const isValidDomain = require('is-valid-domain');
const swaggerUi = require('swagger-ui-express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const socialMediaFunctions = require('./functions/social_media.js');
const wappFunctions = require('./functions/wappalyzer.js');
const pagerankFunctions = require('./functions/openpagerank.js');
const dnsFunctions = require('./functions/dns.js');
const whoisFunctions = require('./functions/whois.js');
const swaggerDocument = require('./swagger.json');

const app = express();

/**
 * Add middleware
 */
// use logger and change session cookie settings if dev env
if (app.get('env') !== 'production') {
  app.use(logger('dev'));
}
// trust the proxy if prod (behind nginx for example)
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
}
// add basic security via helmet
app.use(helmet());

// recognize incoming objects as json objects
app.use(express.json());

// parse incoming requests with url encoded payloads
app.use(express.urlencoded({ extended: false }));
// set up cors
app.use(cors());

/*
    Path used to test domain with wappalyzer
*/
app.get('/domain_data', (req, res) => {
  const queryResults = req.query;
  const { url } = queryResults;
  if (isValidDomain(url, {
    subdomain: false,
  })) {
    wappFunctions.runWappalyzer(url, res);
  } else {
    res.status(500).send('you need to specify a valid domain without the protocol and path');
  }
});

/*
    Path used to test up to 100 domains with openpagerank
*/
app.get('/page_rank', (req, res) => {
  const queryResults = req.query;
  const urls = queryResults.urls.split(',');
  const validUrls = [];
  const invalidUrls = [];
  for (let x = 0; x < urls.length; x += 1) {
    if (isValidDomain(urls[x], {
      subdomain: false,
    })) {
      validUrls.push(urls[x]);
    } else {
      invalidUrls.push(urls[x]);
    }
  }
  if (validUrls.length > 0) {
    pagerankFunctions.runPageRank(validUrls, invalidUrls, res);
  } else {
    res.status(500).send('there are no valid domains in the list.');
  }
});

/*
    Path used to get DNS info for a domain
*/
// CNAME data
app.get('/dns_info', (req, res) => {
  const queryResults = req.query;
  const { url } = queryResults;
  if (isValidDomain(url, {
    subdomain: true,
  })) {
    dnsFunctions.getAllInfo(url, res);
  } else {
    res.status(500).send('you need to specify a valid domain without the protocol and path');
  }
});

/*
    Path used to get whois info for a domain
*/
// registrar
app.get('/whois_info/registrar', (req, res) => {
  const queryResults = req.query;
  const { url } = queryResults;
  if (isValidDomain(url, {
    subdomain: false,
  })) {
    whoisFunctions.getRegistar(url, res);
  } else {
    res.status(500).send('you need to specify a valid domain without the protocol and path');
  }
});
// company  name
app.get('/whois_info/company_name', (req, res) => {
  const queryResults = req.query;
  const { url } = queryResults;
  if (isValidDomain(url, {
    subdomain: false,
  })) {
    whoisFunctions.getCompanyName(url, res);
  } else {
    res.status(500).send('you need to specify a valid domain without the protocol and path');
  }
});

/*
    Path for swagger UI
*/
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*
    return 404 if not any of the paths above
*/
app.use((req, res) => {
  res.sendStatus(404);
});

module.exports = app;
