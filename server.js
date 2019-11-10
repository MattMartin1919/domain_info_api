const express = require('express'), //We are using express for the API
    app = express(),
    port = 3000, //Using port 3000
    bodyParser = require('body-parser'),
    wappFunctions = require("./wappalyzer-function.js"),
    isValidDomain = require('is-valid-domain'),
    swaggerUi = require('swagger-ui-express');
    swaggerDocument = require('./swagger.json');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.listen(port);

/*
    Path used to test one domain with wappalyzer
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