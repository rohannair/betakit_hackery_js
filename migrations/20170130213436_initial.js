
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('urls', function(t) {
    t.increments('id').primary()
    t.string('url')
    t.string('username')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.raw('DROP TABLE urls CASCADE')
}
