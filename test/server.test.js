const request = require('supertest');

describe('loading express and testing both routes', function () {
  let server;
  beforeEach(function () {
    server = require('../server');
  });
  afterEach(function () {
    server.close();
  });
  
  it('responds to /players', function testSlash(done) {
    request(server)
      .get('/players')
      .expect(200, done);
    });
  
  it('responds to /players/52', function testSlash(done) {
  request(server)
    .get('/players/52')
    .expect(200, done);
  });

  it('404 to unvalid player ID /players/1', function testPath(done) {
    request(server)
      .get('/players/1')
      .expect(404, done);
  });
});
