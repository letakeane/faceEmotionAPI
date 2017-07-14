exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('faces', (table) => {
      table.integer('id').primary()
      table.string('src')
      table.string('alt_text')
      table.integer('emotion_id').unsigned()
      table.foreign('emotion_id').references('emotions.id')
      table.integer('race_id').unsigned()
      table.foreign('race_id').references('races.id')
      table.integer('age_id').unsigned()
      table.foreign('age_id').references('ages.id')
      table.integer('gender_id').unsigned()
      table.foreign('gender_id').references('genders.id')
    }),
    knex.schema.createTable('emotions', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
    }),
    knex.schema.createTable('races', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
    }),
    knex.schema.createTable('ages', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
    }),
    knex.schema.createTable('genders', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('faces'),
    knex.schema.dropTable('emotions'),
    knex.schema.dropTable('races'),
    knex.schema.dropTable('ages'),
    knex.schema.dropTable('genders')
  ])
};
