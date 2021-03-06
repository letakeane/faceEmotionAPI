let gendersData = [
  {
    id: 1,
    name: 'more feminine'
  },
  {
    id: 2,
    name: 'androgynous/nonbinary/agender'
  },
  {
    id: 3,
    name: 'more masculine'
  }
]

const createEmotion = (knex, gender) => {
  return knex('genders').insert({
    id: gender.id,
    name: gender.name
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('faces').del()
    .then(() => {
      return knex('genders').del()
        .then(() => {
          let gendersPromises = [];

          gendersData.forEach(gender => { //can't loop through anything in the insert step of knex
            gendersPromises.push(createEmotion(knex, gender));
          });

          return Promise.all(gendersPromises);
        })
      })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
