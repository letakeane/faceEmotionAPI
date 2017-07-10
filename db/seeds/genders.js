let gendersData = [
  {
    name: 'more feminine'
  },
  {
      name: 'androgynous/nonbinary/agender'
    },
  {
      name: 'more masculine'
    }
]

const createEmotion = (knex, gender) => {
  return knex('genders').insert({
    name: gender.name
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('genders').del()
    .then(() => {
      let gendersPromises = [];

      gendersData.forEach(gender => { //can't loop through anything in the insert step of knex
        gendersPromises.push(createEmotion(knex, gender));
      });

      return Promise.all(gendersPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
