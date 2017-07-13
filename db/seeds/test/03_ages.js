let agesData = [
  {
    id: 1,
    name: 'infant'
  },
  {
    id: 2,
    name: 'child'
  },
  {
    id: 3,
    name: 'teen'
  },
  {
    id: 4,
    name: 'adult'
  },
  {
    id: 5,
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
