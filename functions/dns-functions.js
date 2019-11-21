var dns = require('dns');

/*
    Exposed functions
*/
module.exports = {
  getNSInfo: function (url, res) {
    try {
      dns.resolveNs(url, function (err, addresses) {
        if (!err) {
          res.status(200).send({
            "data": {
              addresses
            }
          });
        } else {
          console.log(err);
          res.status(500).send("internal error");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("internal error");
    }
  },
  getCNAMEInfo: function (url, res) {
    try {
      dns.resolveCname(url, function (err, addresses) {
        if (!err) {
          res.status(200).send({
            "data": {
              addresses
            }
          });
        } else if (err && err.code == 'ENODATA') {
          res.status(422).send("no cname data");
        } else {
          res.status(500).send("internal error");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("internal error");
    }
  }
}