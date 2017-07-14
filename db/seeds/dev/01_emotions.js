let emotionsData = [
  {
    id: 1,
    name: 'happiness'
  },
  {
    id: 2,
    name: 'sadness'
  },
  {
    id: 3,
    name: 'fear'
  },
  {
    id: 4,
    name: 'surprise'
  },
  {
    id: 5,
    name: 'anger'
  },
  {
    id: 6,
    name: 'neutral'
  },
  {
    id: 7,
    name: 'confusion'
  },
  {
    id: 8,
    name: 'disgust'
  },
  {
    id: 9,
    name: 'worry'
  },
  {
    id: 10,
    name: 'disappointment'
  }
]

const createEmotion = (knex, emotion) => {
  return knex('emotions').insert({
    id: emotion.id,
    name: emotion.name
  })
};

exports.seed = (knex, Promise) => {
  return knex('faces').del()
    .then(() => {
      return knex('emotions').del()
        .then(() => {
          let emotionsPromises = [];

          emotionsData.forEach(emotion => {
            emotionsPromises.push(createEmotion(knex, emotion));
          });

          return Promise.all(emotionsPromises);
        })
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
