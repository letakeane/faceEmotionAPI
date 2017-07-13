let racesData = [
  {
    id: 1,
    name: 'American Indian/Alaska Native'
  },
  {
    id: 2,
    name: 'Asian/Pacific Islander'
  },
  {
    id: 3,
    name: 'Black/African American'
  },
  {
    id: 4,
    name: 'Hispanic/Latinx'
  },
  {
    id: 5,
    name: 'White/Caucasian'
  },
  {
    id: 6,
    name: 'Multiple/Other'
  }
]

const createEmotion = (knex, race) => {
  return knex('races').insert({
    name: race.name
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('races').del()
    .then(() => {
      let racesPromises = [];

      racesData.forEach(race => { //can't loop through anything in the insert step of knex
        racesPromises.push(createEmotion(knex, race));
      });

      return Promise.all(racesPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
