require('dotenv').config();

const express = require('express'), //We are using express for the API
    app = express(),
    port = process.env.PORT, //Using port 3000
    bodyParser = require('body-parser'),
    wappFunctions = require("./functions/wappalyzer-function.js"),
    pagerankFunctions = require("./functions/openpagerank-functions.js"),
    dnsFunctions = require("./functions/dns-functions.js"),
    whoisFunctions = require("./functions/whois-functions.js"),
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
    Path used to get whois info for a domain
*/
//registrar
app.get("/whois_info/registrar", (req, res, next) => {
  var queryResults = req.query;
  var url = queryResults["url"];
  if (isValidDomain(url, {subdomain: false})) {
    whoisFunctions.getRegistar(url, res);
  } else {
    res.status(422).send("you need to specify a valid domain without the protocol and path");
  }
});
//company  name
app.get("/whois_info/company_name", (req, res, next) => {
  var queryResults = req.query;
  var url = queryResults["url"];
  if (isValidDomain(url, {subdomain: false})) {
    whoisFunctions.getCompanyName(url, res);
  } else {
    res.status(422).send("you need to specify a valid domain without the protocol and path");
  }
});

/*
    Path used for Jira (WIP)
*/
//Post a comment 
app.get("/jira/add_comment", (req, res, next) => {
  var queryResults = req.query;
  var ticket_number = queryResults["ticket_number"];
  var comment = queryResults["comment"];
  var username_pass = queryResults["username_pass"];
  if (ticket_number && comment && username_pass) {
    //post comment in jira ticket using their credentials
  } else {
    res.status(422).send("you need to add the ticket number, comment text, login details");
  }
});


/*
    Path used for OPS API (WIP)
*/
//Get account information
app.get("/ops/account_information", (req, res, next) => {
  var queryResults = req.query;
  var partner_id = queryResults["partner_id"];
  var advertiser_id = queryResults["advertiser_id"];
  if (partner_id || advertiser_id) {
    //get account information from the ops api
  } else {
    res.status(422).send("you need to add the partner id or advertiser id");
  }
});

/*
    account tests (WIP)
*/
//get account information
app.get("/banner/404_test", (req, res, next) => {
  var queryResults = req.query;
  var partner_id = queryResults["partner_id"];
  if (partner_id || adversiter_id) {
    //test the partners banners for any 404 links
  } else {
    res.status(422).send("you need to add the partner id");
  }
});

//test images in feed
app.get("/images/404_test", (req, res, next) => {
  var queryResults = req.query;
  var partner_id = queryResults["partner_id"];
  if (partner_id) {
    //test the partner's feed for any 404 image links
  } else {
    res.status(422).send("you need to add the partner id");
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