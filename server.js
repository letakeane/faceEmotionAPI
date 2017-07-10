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

// app.get('/api/v1/folders/:id/links', (request, response) => {
//   database('links').where('folder_id', request.params.id).select()
//     .then((links) => {
//       if (links.length) {
//         response.status(200).json(links);
//       } else {
//         response.status(200).json({
//           message: `No links found in folder with id of ${request.params.id}`
//         });
//       }
//     })
//   .catch((error) => {
//     response.status(500).json({ error });
//   });
// });
//
// app.post('/api/v1/folders', (request, response) => {
//   const folder = request.body;
//
//   if (!folder.name) {
//     return response.status(422).send({
//       error: 'No folder name provided'
//     });
//   }
//
//   database('folders').insert(folder, 'id')
//     .then((folderId) => {
//       console.log(folderId, 'folderId response');
//       response.status(201).json({ id: folderId[0] });
//     })
//   .catch((error) => {
//     response.status(500).json({ error });
//   });
// });
//
// app.post('/api/v1/links', (request, response) => {
//   const link = request.body;
//   link.shortened_url = `${shortid.generate()}`;
//
//   if (!link.shortened_url) {
//     return response.status(422).send({
//       error: 'An error occurred while generating the shortened url; please try again'
//     });
//   }
//
//   for (let requiredParameter of ['name', 'url', 'folder_id']) {
//       if (!link[requiredParameter]) {
//         return response.status(422).json({
//           error: `Expected format: { name: <String>, url: <String>, folder_id: <Integer> }. You are missing a ${requiredParameter} property.`
//         });
//       }
//     }
//
//     database('links').insert(link, 'id') //Inserting the link, returning the generated id of that paper
//       .then((linkId) => {
//         response.status(201).json({ id: linkId[0]});
//       })
//     .catch((error) => {
//       response.status(500).json({ error });
//     });
// });
//
// app.get('/api/v1/links/click/:id', (request) => {
//   const id = request.params.id;
//   database('links').where('id', id).increment('visits', 1)
//     .then((response) => response.json())
//   .catch((error) => console.log('Error incrementing link visits: ', error));
// });
//
// app.get('/api/:shortened_url', (request, response) => {
//   const shortened_url = request.params.shortened_url;
//
//   database('links').where('shortened_url', '=', shortened_url).select('url')
//   .then(url => {
//     const originalUrl = url[0].url;
//     console.log(`Redirecting http://${domain}/api/${shortened_url} to: `, originalUrl);
//     return response.redirect(302, `http://${originalUrl}`);
//   })
//   .catch((error) => {
//     response.status(500).json({ error });
//   });
// });

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});

module.exports = app;
