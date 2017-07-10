let emotionsData = [
  {
    name: 'happiness'
  },
  {
    name: 'sadness'
  },
  {
    name: 'fear'
  },
  {
    name: 'surprise'
  },
  {
    name: 'anger'
  },
  {
    name: 'neutral'
  },
  {
    name: 'confusion'
  },
  {
    name: 'disgust'
  },
  {
    name: 'worry'
  },
  {
    name: 'disappointment'
  }
]

const createEmotion = (knex, emotion) => {
  return knex('emotions').insert({
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
