var request = require('request');

/*
    Exposed functions
*/
module.exports = {
  runPageRank: function (goodURLS, badURLS, res) {
    try {
      var OpenPageRankConfig = {
        url: 'https://openpagerank.com/api/v1.0/getPageRank',
        headers: {
          'API-OPR': process.env.OPEN_PAGE_RANK_KEY,
        },
        qs: {
          domains: goodURLS,
        }
      };
      request(OpenPageRankConfig, function (error, response, body) {
        if (error) {
          console.log(error);
        }
        if (response && response.statusCode == 200) {
          res.status(200).send({
            "data": {
              "valid_domains": JSON.parse(body)['response'],
              "invalid_domains": badURLS,
            }
          });
        } else {
          res.status(500).send("internal server error");
        }
      });

    } catch (err) {
      console.log(err);
      res.status(500).send("internal error");
    }
  }
}