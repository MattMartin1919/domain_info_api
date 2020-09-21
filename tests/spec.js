/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app');

const server = http.createServer(app);
chai.use(chaiHttp);
chai.should();

// index page
describe('Test swagger page', () => {
  it('responds with 200', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

// domain data
describe('Test domain data endpoint', function () {
  this.timeout(5000); // this endpoint might take a while to run
  it('responds with 200', (done) => {
    chai.request(server)
      .get('/domain_data?url=test.com')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
