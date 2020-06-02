/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app');

const server = http.createServer(app);
chai.use(chaiHttp);
chai.should();


describe('GET /', () => {
  it('responds with 200', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
