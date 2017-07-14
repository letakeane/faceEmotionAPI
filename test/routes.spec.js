const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const domain = process.env.DOMAIN_ENV || 'localhost:3002';
const jwt = require('jsonwebtoken');
const config = require('dotenv').config();

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);



const headers = {
  'Content-Type': 'application/json',
  'Authorization': process.env.TOKEN
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

  // AUTHENTICATION TESTS

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
      response.should.have.status(200);
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
      response.should.have.status(403);
      response.body.should.be.a('object');
      response.body.should.have.property('message');
      response.body.message.should.equal('Your credentials are invalid');
      done();
    });
  });

  // FACES ENDPOINTS TESTS

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
      response.body.length.should.equal(8);
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
    .set('Authorization', process.env.TOKEN)
    .send({
      'id': 34,
      'src': 'src',
      'alt_text': 'alt text',
      'emotion_id': 1,
      'race_id': 1,
      'age_id': 1,
      'gender_id': 1
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(34);
      done();
    });
  });

  it('should create a new face, SAD PATH', (done) => {
    chai.request(server)
    .post('/api/v1/faces/new')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Expected format: { arc: <String>, alt_text: <String>, emotion_id: <Integer>, race_id: <Integer>, age_id: <Integer>, gender_id: <Integer> }. You are missing a src property.');
      done();
    });
  });

  it('should patch a face, HAPPY PATH', (done) => {
    chai.request(server)
    .patch('/api/v1/faces/33')
    .set('Authorization', process.env.TOKEN)
    .send({
      'alt_text': 'updated alt text'
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('rowsUpdated');
      response.body.rowsUpdated.should.equal(1);
      done();
    });
  });

  it('should patch a face, SAD PATH', (done) => {
    chai.request(server)
    .patch('/api/v1/faces/34')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Could not update the faces data for face with id of 33');
      done();
    });
  });

  it('should delete a face, HAPPY PATH', (done) => {
    chai.request(server)
    .delete('/api/v1/faces/33')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(204);
      done();
    });
  });

  it('should patch a face, SAD PATH', (done) => {
    chai.request(server)
    .delete('/api/v1/faces/33')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Could not delete face with id of 34 because it did not exist');
      done();
    });
  });

  // EMOTIONS ENDPOINTS TESTS

  it('should return all emotions, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/emotions')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(10);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('happiness');
      done();
    });
  })

  it('should return the emotion with a specific id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/emotions/3')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('fear');
      done();
    });
  })

  it('should return the emotion with a specific id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/emotions/11')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No emotions data found with id of 11');
      done();
    });
  })

  it('should create a new emotion, HAPPY PATH', (done) => {
    chai.request(server)
    .post('/api/v1/emotions/new')
    .set('Authorization', process.env.TOKEN)
    .send({
      id: 11,
      name: 'new emotion'
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(11);
      done();
    });
  });

  it('should create a new emotion, SAD PATH', (done) => {
    chai.request(server)
    .post('/api/v1/emotions/new')
    .set('Authorization', process.env.TOKEN)
    .send({
      incorrectKey: 'nonsense!'
    })
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('No name provided');
      done();
    });
  });

  it('should patch an emotion, HAPPY PATH', (done) => {
    chai.request(server)
    .patch('/api/v1/emotions/11')
    .set('Authorization', process.env.TOKEN)
    .send({
      name: 'boredom'
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('rowsUpdated');
      response.body.rowsUpdated.should.equal(0);
      done();
    });
  });

  it('should patch an emotion, SAD PATH', (done) => {
    chai.request(server)
    .patch('/api/v1/emotions/10')
    .set('Authorization', process.env.TOKEN)
    .send({
      'notARealKey': 'blah blah blah'
    })
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Could not update the emotions data for emotion with id of 10');
      done();
    });
  });

  it('should delete an emotion, HAPPY PATH', (done) => {
    chai.request(server)
    .delete('/api/v1/emotions/10')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(204);
      done();
    });
  });

  it('should delete an emotion, SAD PATH', (done) => {
    chai.request(server)
    .delete('/api/v1/emotions/10')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Could not delete emotion with id of 10 because it did not exist');
      done();
    });
  });

  // RACE ENDPOINTS TESTS
  it('should return all races, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/races')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(6);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('American Indian/Alaska Native');
      done();
    });
  })

  it('should return the races with a specific id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/races/3')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('Black/African American');
      done();
    });
  })

  it('should return the races with a specific id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/races/11')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No races data found with id of 11');
      done();
    });
  })

  it('should create a new race, HAPPY PATH', (done) => {
    chai.request(server)
    .post('/api/v1/races/new')
    .set('Authorization', process.env.TOKEN)
    .send({
      id: 11,
      name: 'not applicable'
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(11);
      done();
    });
  });

  it('should create a new race, SAD PATH', (done) => {
    chai.request(server)
    .post('/api/v1/races/new')
    .set('Authorization', process.env.TOKEN)
    .send({
      incorrectKey: 'nonsense!'
    })
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('No name provided');
      done();
    });
  });

  it('should delete an race, HAPPY PATH', (done) => {
    chai.request(server)
    .delete('/api/v1/races/6')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(204);
      done();
    });
  });

  it('should delete an race, SAD PATH', (done) => {
    chai.request(server)
    .delete('/api/v1/races/11')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Could not delete race with id of 11 because it did not exist');
      done();
    });
  });

  // AGES ENDPOINTS TESTS
  it('should return all ages, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/ages')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(5);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('infant');
      done();
    });
  })

  it('should return the ages with a specific id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/ages/3')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('teen');
      done();
    });
  })

  it('should return the ages with a specific id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/ages/6')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No ages data found with id of 6');
      done();
    });
  })

  // GENDERS ENDPOINTS TESTS
  it('should return all genders, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/genders')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(3);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('more feminine');
      done();
    });
  })

  it('should return the genders with a specific id, HAPPY PATH', (done) => {
    chai.request(server)
    .get('/api/v1/genders/2')
    .end((err, response) => {
      response.body.sort((a, b) => a.id - b.id);
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('androgynous/nonbinary/agender');
      done();
    });
  })

  it('should return the genders with a specific id, SAD PATH', (done) => {
    chai.request(server)
    .get('/api/v1/genders/4')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('No genders data found with id of 4');
      done();
    });
  })

});
