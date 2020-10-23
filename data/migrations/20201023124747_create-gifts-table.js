exports.up = function (knex) {
  return knex.schema.createTable("gifts", (tbl) => {
    tbl.increments();
    tbl
      .integer("relationship_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("relationships")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("asset_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("assets")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("gifts");
};
