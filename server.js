require('dotenv').config();

const express = require('express'), //We are using express for the API
    app = express(),
    port = process.env.PORT, //Using port 3000
    bodyParser = require('body-parser'),
    wappFunctions = require("./functions/wappalyzer-function.js"),
    pagerankFunctions = require("./functions/openpagerank-functions.js"),
    dnsFunctions = require("./functions/dns-functions.js"),
    isValidDomain = require('is-valid-domain'),
    swaggerUi = require('swagger-ui-express');
    swaggerDocument = require('./swagger.json');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.listen(port);

/*
    Path used to test domain with wappalyzer
*/
app.get("/domain_data", (req, res, next) => {
    var queryResults = req.query;
    var url = queryResults["url"];
    if (isValidDomain(url, {subdomain: false})) {
        wappFunctions.runWappalyzer(url, res);
    } else {
        res.status(422).send("you need to specify a valid domain without the protocol and path");
    }
});

/*
    Path used to test up to 100 domains with openpagerank
*/
app.get("/page_rank", (req, res, next) => {
  var queryResults = req.query;
  var urls = queryResults["urls"].split(",");
  var goodURLS = [];
  var badURLS = [];
  for (x in urls){
    if (isValidDomain(urls[x], {subdomain: false})){
      goodURLS.push(urls[x]);
    } else {
      badURLS.push(urls[x]);
    }
  }
  if (goodURLS.length > 0){
    pagerankFunctions.runPageRank(goodURLS, badURLS, res);
  } else {
    res.status(422).send("there are no valid domains in the list.");
  }
});


/*
    Path used to get DNS info for a domain
*/
//NS data
app.get("/dns_info/ns", (req, res, next) => {
  var queryResults = req.query;
  var url = queryResults["url"];
  if (isValidDomain(url, {subdomain: false})) {
    dnsFunctions.getNSInfo(url, res);
  } else {
    res.status(422).send("you need to specify a valid domain without the protocol and path");
  }
});
//CNAME data
app.get("/dns_info/cname", (req, res, next) => {
  var queryResults = req.query;
  var url = queryResults["url"];
  if (isValidDomain(url, {subdomain: true})) {
    dnsFunctions.getCNAMEInfo(url, res);
  } else {
    res.status(422).send("you need to specify a valid domain without the protocol and path");
  }
});

/*
    Path for swagger UI
*/
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*
    return 404 if not any of the paths above
*/
app.use(function (req, res) {
    res.status(404).send(req.originalUrl + ' not found');
});


console.log('Data-Api server started on: ' + port);