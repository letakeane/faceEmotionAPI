const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
// const domain = process.env.DOMAIN_ENV || 'localhost:3002';
const jwt = require('jsonwebtoken');
const config = require('dotenv').config().parsed;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
   next();
});

if (!config.CLIENT_SECRET) {
  throw 'Make sure you have a CLIENT_SECRET in your .env file';
}

app.set('secretKey', config.CLIENT_SECRET);
app.set('port', process.env.PORT || 3002);

app.locals.title = 'faceEmotionAPI';

// AUTHENTICATION
const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.params.token ||
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

app.post('/api/v1/requestAuthentication', (request, response) => {
  const userInfo = request.body;

  if (userInfo.username !== config.USERNAME || userInfo.password !== config.PASSWORD) {
    response.status(403).send({
      success: false,
      message: 'Your credentials are invalid'
    });
  } else {
    const token = jwt.sign(userInfo, app.get('secretKey'), {
      expiresIn: 604800
    });

    response.json({
      success: true,
      message: 'Token is valid for one week',
      username: userInfo.username,
      token: token
    });
  }
});

// FACES ENDPOINTS
app.get('/api/v1/faces', (request, response) => {
  database('faces').select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: 'No faces data found'
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/faces/:id', (request, response) => {
  database('faces').where('id', request.params.id).select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: `No faces data found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });});

app.get('/api/v1/faces/emotions/:emotion_id', (request, response) => {
  if ( Object.keys(request.query).includes('gender') ) {
    database('faces').where('emotion_id', request.params.emotion_id).where('gender_id', request.query.gender).select()
      .then((faces) => {
        if (faces.length) {
          response.status(200).json(faces);
        } else {
          response.status(404).json({
            error: `No faces data found with emotion_id of ${request.params.emotion_id} and gender_id of ${request.query.gender}`
          });
        }
      })
    .catch((error) => {
      response.status(500).json({ error });
    });
  } else if ( Object.keys(request.query).includes('race') ) {
    database('faces').where('emotion_id', request.params.emotion_id).where('race_id', request.query.race).select()
      .then((faces) => {
        if (faces.length) {
          response.status(200).json(faces);
        } else {
          response.status(404).json({
            error: `No faces data found with emotion_id of ${request.params.emotion_id} and race_id of ${request.query.race}`
          });
        }
      })
    .catch((error) => {
      response.status(500).json({ error });
    });
  } else if ( Object.keys(request.query).includes('age') ) {
    database('faces').where('emotion_id', request.params.emotion_id).where('age_id', request.query.age).select()
      .then((faces) => {
        if (faces.length) {
          response.status(200).json(faces);
        } else {
          response.status(404).json({
            error: `No faces data found with emotion_id of ${request.params.emotion_id} and age_id of ${request.query.age}`
          });
        }
      })
    .catch((error) => {
      response.status(500).json({ error });
    });
  } else {
    database('faces').where('emotion_id', request.params.emotion_id).select()
      .then((faces) => {
        if (faces.length) {
          response.status(200).json(faces);
        } else {
          response.status(404).json({
            error: `No faces data found with emotion_id of ${request.params.emotion_id}`
          });
        }
      })
    .catch((error) => {
      response.status(500).json({ error });
    });
  }
});

app.get('/api/v1/faces/ages/:age_id', (request, response) => {
  database('faces').where('age_id', request.params.age_id).select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: `No faces data found with age_id of ${request.params.age_id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/faces/races/:race_id', (request, response) => {
  database('faces').where('race_id', request.params.race_id).select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: `No faces data found with race_id of ${request.params.race_id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/faces/genders/:gender_id', (request, response) => {
  database('faces').where('gender_id', request.params.gender_id).select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: `No faces data found with gender_id of ${request.params.gender_id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.post('/api/v1/faces/new', checkAuth, (request, response) => {
  const face = request.body;

  for (let requiredParameter of ['src', 'alt_text', 'emotion_id', 'race_id', 'age_id', 'gender_id']) {
    if (!face[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: { arc: <String>, alt_text: <String>, emotion_id: <Integer>, race_id: <Integer>, age_id: <Integer>, gender_id: <Integer> }. You are missing a ${requiredParameter} property.`
      });
    }
  }

  database('faces').insert(face, 'id')
    .then((faceId) => {
      response.status(201).json({ id: faceId[0] });
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.patch('/api/v1/faces/:id', checkAuth, (request, response) => {
  const updatedAltText = request.body.alt_text;

  database('faces').where('id', request.params.id).select()
  .update('alt_text', updatedAltText)
  .then((rowsUpdated) => {
    response.status(201).json({ rowsUpdated: rowsUpdated });
  })
  .catch(() => {
    response.status(422).json({
      error: `Could not update the faces data for face with id of ${request.params.id}`
    });
  });
});

app.delete('/api/v1/faces/:id', checkAuth, (request, response) => {
  database('faces').where('id', request.params.id).del()
  .then((data) => {
    if(data > 0) {
      response.status(204).json({ 'message': `Face with id of ${request.params.id} has been deleted` });
    } else {
      response.status(422).json({ 'error': `Could not delete face with id of ${request.params.id} because it did not exist` });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

// EMOTIONS ENDPOINTS
app.get('/api/v1/emotions', (request, response) => {
  database('emotions').select()
  .then((emotions) => {
    if (emotions.length) {
      response.status(200).json(emotions);
    } else {
      response.status(404).json({
        error: 'No emotions data found'
      });
    }
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/emotions/:id', (request, response) => {
  database('emotions').where('id', request.params.id).select()
    .then((emotions) => {
      if (emotions.length) {
        response.status(200).json(emotions);
      } else {
        response.status(404).json({
          error: `No emotions data found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.post('/api/v1/emotions/new', checkAuth, (request, response) => {
  const emotion = request.body;

  if (!emotion.name) {
    return response.status(422).send({
      error: 'No name provided'
    });
  }

  database('emotions').insert(emotion, 'id')
    .then((emotionId) => {
      response.status(201).json({ id: emotionId[0]});
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.patch('/api/v1/emotions/:id', checkAuth, (request, response) => {
  const updatedEmotionName = request.body.name;

  database('emotions').where('id', request.params.id).select()
  .update('name', updatedEmotionName)
  .then((rowsUpdated) => {
    response.status(201).json({ rowsUpdated: rowsUpdated });
  })
  .catch(() => {
    response.status(422).json({
      error: `Could not update the emotions data for emotion with id of ${request.params.id}`
    });
  });
});

app.delete('/api/v1/emotions/:id', checkAuth, (request, response) => {
  database('emotions').where('id', request.params.id).del()
  .then((data) => {
    if(data > 0) {
      response.status(204).json({ 'message': `Emotion with id of ${request.params.id} has been deleted` });
    } else {
      response.status(422).json({ 'error': `Could not delete emotion with id of ${request.params.id} because it did not exist` });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

// RACES ENDPOINTS
app.get('/api/v1/races', (request, response) => {
  database('races').select()
  .then((races) => {
    if (races.length) {
      response.status(200).json(races);
    } else {
      response.status(404).json({
        error: 'No races data found'
      });
    }
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/races/:id', (request, response) => {
  database('races').where('id', request.params.id).select()
    .then((races) => {
      if (races.length) {
        response.status(200).json(races);
      } else {
        response.status(404).json({
          error: `No races data found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.post('/api/v1/races/new', checkAuth, (request, response) => {
  const race = request.body;

  if (!race.name) {
    return response.status(422).send({
      error: 'No name provided'
    });
  }

  database('races').insert(race, 'id') //Inserting the link, returning the generated id of that paper
    .then((raceId) => {
      response.status(201).json({ id: raceId[0]});
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/races/:id', checkAuth, (request, response) => {
  database('races').where('id', request.params.id).del()
  .then((data) => {
    if(data > 0) {
      response.status(204).json({ 'message': `Race with id of ${request.params.id} has been deleted` });
    } else {
      response.status(422).json({ 'error': `Could not delete race with id of ${request.params.id} because it did not exist` });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

// AGES ENDPOINTS
app.get('/api/v1/ages', (request, response) => {
  database('ages').select()
  .then((ages) => {
    if (ages.length) {
      response.status(200).json(ages);
    } else {
      response.status(404).json({
        error: 'No ages data found'
      });
    }
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/ages/:id', (request, response) => {
  database('ages').where('id', request.params.id).select()
    .then((ages) => {
      if (ages.length) {
        response.status(200).json(ages);
      } else {
        response.status(404).json({
          error: `No ages data found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

// GENDERS ENDPOINTS
app.get('/api/v1/genders', (request, response) => {
  database('genders').select()
  .then((genders) => {
    if (genders.length) {
      response.status(200).json(genders);
    } else {
      response.status(404).json({
        error: 'No genders data found'
      });
    }
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/genders/:id', (request, response) => {
  database('genders').where('id', request.params.id).select()
    .then((genders) => {
      if (genders.length) {
        response.status(200).json(genders);
      } else {
        response.status(404).json({
          error: `No genders data found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

// LISTEN
app.listen(app.get('port'), () => {
});

module.exports = app;
