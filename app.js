require('dotenv').config();
const express = require('express');
const isValidDomain = require('is-valid-domain');
const swaggerUi = require('swagger-ui-express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const wappFunctions = require('./functions/wappalyzer-function.js');
const pagerankFunctions = require('./functions/openpagerank-functions.js');
const dnsFunctions = require('./functions/dns-functions.js');
const whoisFunctions = require('./functions/whois-functions.js');
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

// parse incoming requests with urlencoded payloads
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
    res.status(422).send('you need to specify a valid domain without the protocol and path');
  }
});

/*
    Path used to test up to 100 domains with openpagerank
*/
app.get('/page_rank', (req, res) => {
  const queryResults = req.query;
  const urls = queryResults.urls.split(',');
  const goodURLS = [];
  const badURLS = [];
  for (let x = 0; x < urls.length; x += 1) {
    if (isValidDomain(urls[x], {
      subdomain: false,
    })) {
      goodURLS.push(urls[x]);
    } else {
      badURLS.push(urls[x]);
    }
  }
  if (goodURLS.length > 0) {
    pagerankFunctions.runPageRank(goodURLS, badURLS, res);
  } else {
    res.status(422).send('there are no valid domains in the list.');
  }
});

/*
    Path used to get DNS info for a domain
*/
// NS data
app.get('/dns_info/ns', (req, res) => {
  const queryResults = req.query;
  const { url } = queryResults;
  if (isValidDomain(url, {
    subdomain: false,
  })) {
    dnsFunctions.getNSInfo(url, res);
  } else {
    res.status(422).send('you need to specify a valid domain without the protocol and path');
  }
});
// CNAME data
app.get('/dns_info/cname', (req, res) => {
  const queryResults = req.query;
  const { url } = queryResults;
  if (isValidDomain(url, {
    subdomain: true,
  })) {
    dnsFunctions.getCNAMEInfo(url, res);
  } else {
    res.status(422).send('you need to specify a valid domain without the protocol and path');
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
    res.status(422).send('you need to specify a valid domain without the protocol and path');
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
    res.status(422).send('you need to specify a valid domain without the protocol and path');
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
