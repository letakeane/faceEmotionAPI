const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const domain = process.env.DOMAIN_ENV || 'localhost:3002';
// const checkAuth = () => {
//   // Add checkAuth function here
//
// };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
   next();
});

app.set('port', process.env.PORT || 3002);

app.locals.title = 'faceEmotionAPI';
app.locals.faces = {};

app.get('/', (request, response) => {
  response.sendFile('index.html');
  response.sendFile('index.js');
});

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

app.get('/api/v1/faces/:emotion_id', (request, response) => {
  database('faces').where('emotion_id', '=', request.params.emotion_id).select()
    .then((faces) => {
      if (faces.length) {
        response.status(200).json(faces);
      } else {
        response.status(404).json({
          error: `No faces data found with id of ${request.params.emotion_id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.post('/api/v1/faces', /*checkAuth,*/ (request, response) => {
  // Admin may post new faces data to the faces table
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});

module.exports = app;
