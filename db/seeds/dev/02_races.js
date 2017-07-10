let racesData = [
  {
    name: 'American Indian/Alaska Native'
  },
  {
      name: 'Asian/Pacific Islander'
    },
  {
      name: 'Black/African American'
    },
  {
      name: 'Hispanic/Latinx'
    },
  {
      name: 'White/Caucasian'
    },
  {
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
