const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const database = require('knex')(config);
const domain = process.env.DOMAIN_ENV || 'localhost:3002';
// const reRouteLink = require('./routes.js')
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
      }

      else {
        request.decoded = decoded;
        next();
      }
    });
  }

  else {
    return response.status(403).send({
      success: false,
      message: 'You must be authorized to hit this endpoint'
    });
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
   next();
});

app.set('secretKey', config.CLIENT_SECRET);

app.set('port', process.env.PORT || 3002);

app.locals.title = 'faceEmotionAPI';
app.locals.faces = {};


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
  });
});

app.get('/api/v1/faces/emotions/:emotion_id', (request, response) => {
  database('faces').where('emotion_id', request.params.emotion_id).select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: `No faces data found with emotion_id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/faces/ages/:age_id', (request, response) => {
  database('faces').where('age_id', request.params.age_id).select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: `No faces data found with age_id of ${request.params.id}`
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
          error: `No faces data found with race_id of ${request.params.id}`
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
          error: `No faces data found with gender_id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
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
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});

module.exports = app;
