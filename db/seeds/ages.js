let agesData = [
  {
    name: 'infant'
  },
  {
      name: 'child'
    },
  {
      name: 'teen'
    },
  {
      name: 'adult'
    },
  {
      name: 'elder'
    }
]

const createEmotion = (knex, age) => {
  return knex('ages').insert({
    name: age.name
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('ages').del()
    .then(() => {
      let agesPromises = [];

      agesData.forEach(age => {
        agesPromises.push(createEmotion(knex, age));
      });

      return Promise.all(agesPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
