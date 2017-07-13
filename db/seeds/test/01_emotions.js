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
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('emotions').del()
    .then(() => {
      let emotionsPromises = [];

      emotionsData.forEach(emotion => { //can't loop through anything in the insert step of knex
        emotionsPromises.push(createEmotion(knex, emotion));
      });

      return Promise.all(emotionsPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
