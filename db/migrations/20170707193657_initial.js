exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('faces', (table) => {
      table.increments('id').primary()
      table.string('src')
      table.json('scores')
      table.integer('emotion_id').unsigned()
      table.foreign('emotion_id').references('emotions.id')
    }),
    knex.schema.createTable('emotions', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('faces'),
    knex.schema.dropTable('emotions')
  ])
};
