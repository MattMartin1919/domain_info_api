var whois = require('whois');

/*
    Exposed functions
*/
module.exports = {
  getRegistar: function (url, res) {
    try {
      whois.lookup(url, function (err, data) {
        data = data.split("\n");
        for (x in data) {
          if (data[x].includes("Registrar: ")) {
            if (data[x].split(":")[1].trim() != "") {
              res.status(200).send(data[x].split(":")[1].trim());
            } else {
              res.status(200).send("unknown");
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("internal error");
    }
  },
  getCompanyName: function (url, res) {
    try {
      whois.lookup(url, function (err, data) {
        data = data.split("\n");
        for (x in data) {
          if (data[x].includes("Registrant Organization: ")) {
            if (data[x].split(":")[1].trim() != "") {
              res.status(200).send(data[x].split(":")[1].trim());
            } else {
              res.status(200).send("unknown");
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("internal error");
    }
  }
}