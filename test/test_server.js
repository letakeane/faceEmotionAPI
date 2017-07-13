const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const domain = process.env.DOMAIN_ENV || 'localhost:3002';
const jwt = require('jsonwebtoken');
const config = require('dotenv').config().parsed;

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.param('token') ||
                request.headers['authorization'];

  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          message: 'Invalid authorization token.'
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
      success: false,
      message: 'You are not authorized to use this endpoint'
    });
  }
};

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxldGFrIiwicGFzc3dvcmQiOiJsYXRlcnRhdGVyIiwiaWF0IjoxNDk5OTczNjU2LCJleHAiOjE1MDA1Nzg0NTZ9.MRqaKcyOt2lETmpVbUJvTyMIsWkyBPlDhA2kHBWgKfA'
}


describe('API endpoints tests', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => { done() })
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => { done() })
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
    .get('/POTATO')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });

  it('should return an authentication token, HAPPY PATH', (done) => {
    chai.request(server)
    .post('/api/v1/requestAuthentication')
    .send({ username: 'letak', password: 'latertater' })
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('message');
      response.body.message.should.equal('Token is valid for one week');
      response.body.should.have.property('token');
      done();
    });
  });

  it('should not return an authentication token, SAD PATH', (done) => {
    chai.request(server)
    .post('/api/v1/requestAuthentication')
    .send({ username: 'letak', password: 'hellospud' })
    .end((err, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('message');
      response.body.message.should.equal('Your credentials are invalid');
      done();
    });
  });

  it('should return all faces, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(33);
      response.body[0].should.have.property('src');
      response.body[0].src.should.equal('https://upload.wikimedia.org/wikipedia/commons/b/b2/Laughing_Girl_%28Imagicity_1138%29.jpg');
      done();
    });
  })

  it('should return all faces with specific id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/3')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('src');
      response.body[0].src.should.equal('https://static.pexels.com/photos/112642/pexels-photo-112642.jpeg');
      done();
    });
  })

  it('should return all faces with specific id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/90')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No faces data found with id of 90');
      done();
    });
  })

  it('should return all faces with specific emotion id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/emotions/1')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(6);
      response.body[0].should.have.property('src');
      response.body[0].src.should.equal('https://upload.wikimedia.org/wikipedia/commons/b/b2/Laughing_Girl_%28Imagicity_1138%29.jpg');
      done();
    });
  })

  it('should return all faces with specific emotion id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/emotions/90')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No faces data found with emotion_id of 90');
      done();
    });
  })


  it('should return all faces with specific emotion id and query, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/emotions/1?gender=2')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(3);
      response.body[0].should.have.property('src');
      response.body[0].src.should.equal('https://static.pexels.com/photos/112642/pexels-photo-112642.jpeg');
      done();
    });
  })

  it('should return all faces with specific emotion id and query, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/emotions/1?gender=90')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No faces data found with emotion_id of 1 and gender_id of 90');
      done();
    });
  })

  it('should return all faces with specific age id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/ages/1')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(2);
      response.body[0].should.have.property('src');
      response.body[0].src.should.equal('https://c1.staticflickr.com/1/87/212946929_682fc38f9e_b.jpg');
      done();
    });
  })

  it('should return all faces with specific age id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/ages/90')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No faces data found with age_id of 90');
      done();
    });
  })

  it('should return all faces with specific race id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/races/2')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(7);
      response.body[0].should.have.property('src');
      response.body[0].src.should.equal('https://static.pexels.com/photos/112642/pexels-photo-112642.jpeg');
      done();
    });
  })

  it('should return all faces with specific race id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/races/90')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No faces data found with race_id of 90');
      done();
    });
  })

  it('should return all faces with specific gender id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/genders/2')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(6);
      response.body[0].should.have.property('src');
      response.body[0].src.should.equal('https://static.pexels.com/photos/112642/pexels-photo-112642.jpeg');
      done();
    });
  })

  it('should return all faces with specific gender id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/faces/genders/90')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No faces data found with gender_id of 90');
      done();
    });
  })

  it('should create a new face, HAPPY PATH', (done) => {
    chai.request(server)
    .post('/api/v1/faces/new')
    .send({
      method: 'POST',
      headers: headers,
      body: {
        src: 'src',
        alt_text: 'alt text',
        'emotion_id': 1,
        'race_id': 1,
        'age_id': 1,
        'gender_id': 1
      }
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal('34');
      done();
    });
  });

  it('should create a new face, SAD PATH', (done) => {
    chai.request(server)
    .post('/api/v1/faces/new')
    .send({
      method: 'POST',
      headers: headers,
      body: {
        alt_text: 'alt text',
        'emotion_id': 1,
        'race_id': 1,
        'age_id': 1,
        'gender_id': 1
      }
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Expected format: { arc: <String>, alt_text: <String>, emotion_id: <Integer>, race_id: <Integer>, age_id: <Integer>, gender_id: <Integer> }. You are missing a src property.');
      done();
    });
  });

  it('should patch a face, HAPPY PATH', (done) => {
    chai.request(server)
    .patch('/api/v1/faces/34')
    .send({
      method: 'PATCH',
      headers: headers,
      body: {
        alt_text: 'updated alt text'
      }
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('alt_text');
      response.body.id.should.equal('updated alt text');
      done();
    });
  });

  it('should patch a new face, SAD PATH', (done) => {
    chai.request(server)
    .patch('/api/v1/faces/34')
    .send({
      method: 'PATCH',
      headers: headers,
      body: {
        'gender_id': 3
      }
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Could not update the faces data for face with id of 34');
      done();
    });
  });



});
