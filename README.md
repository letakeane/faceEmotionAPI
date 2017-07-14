# faceEmotionAPI - currently **IN PROGRESS**

The faceEmotionAPI provides a dataset of images of human faces (gathered via google searches for images marked "for reuse with modification"), along with relevant alt text, a human-identified primary emotion, and basic demographic information of the subject in each image (age, race, gender).

The API is a RESTful API.

***

## Endpoints
### GET

#### GET faces data
- `/api/v1/faces` retrieves all the faces in the database.
- `/api/v1/faces/:id` retrieves the face data with a given id.
- `/api/v1/faces/emotions/:emotion_id` retrieves all faces with a given emotion id.
- `/api/v1/faces/emotions/:emotion_id?gender=:gender_id` retrieves all faces with a given emotion id, narrowed down by a given gender id.
- `/api/v1/faces/emotions/:emotion_id?race=:race_id` retrieves all faces with a given emotion id, narrowed down by a given race id.
- `/api/v1/faces/emotions/:emotion_id?age=:age_id` retrieves all faces with a given emotion id, narrowed down by a given age id.
- `/api/v1/faces/ages/:age_id` retrieves all faces with a given age id.
- `/api/v1/faces/races/:race_id` retrieves all faces with a given race id.
- `/api/v1/faces/genders/:gender_id` retrieves all faces with a given gender id.

#### GET emotions data
- `/api/v1/emotions` retrieves all the emotions in the database.
- `/api/v1/emotions/:id` retrieves the emotion data with a given id.

#### GET races data
- `/api/v1/races` retrieves all the races in the database.
- `/api/v1/races/:id` retrieves the race data with a given id.

#### GET ages data
- `/api/v1/ages` retrieves all the ages in the database.
- `/api/v1/ages/:id` retrieves the age data with a given id.

#### GET genders data
- `/api/v1/genders` retrieves all the genders in the database.
- `/api/v1/genders/:id` retrieves the gender data with a given id.




### POST

#### POST faces data
- `/api/v1/faces/new` will create a new row in the faces table. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`), and the request must include a body containing `{ src: <String>, alt_text: <String>, emotion_id: <Integer>, race_id: <Integer>, age_id: <Integer>, gender_id: <Integer> }`.

#### POST emotions data
- `/api/v1/emotions/new` will create a new row in the emotions table. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`), and the request must include a body containing `{ name: <STRING> }`.

#### POST races data
- `/api/v1/races/new` will create a new row in the races table. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`), and the request must include a body containing `{ name: <STRING> }`.




### PATCH

#### PATCH faces data
- `/api/v1/faces/:id` will patch the alt_text for the face targeted with the id parameter. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`), and the request must include a body containing `{ alt_text: <STRING> }`.

#### PATCH emotions data
- `/api/v1/emotions/:id` will patch the name for the emotion targeted with the id parameter. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`), and the request must include a body containing `{ name: <STRING> }`.



### DELETE

#### DELETE faces data
- `/api/v1/faces/:id` will delete the face data row targeted with the id parameter. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`) and does not require a body.

#### DELETE emotions data
- `/api/v1/emotions/:id` will delete the emotion data row targeted with the id parameter. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`) and does not require a body.

#### DELETE races data
- `/api/v1/races/:id` will delete the race data row targeted with the id parameter. This requires authentication, to be included in the header (`{ "Authorization": TOKEN }`) and does not require a body.



***

## Authentication

// Access to the `/api/v1/requestAuthentication` endpoint to receive your JWT token (allowing access to the POST, PATCH, and DELETE endpoints) is currently closed.
