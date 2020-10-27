exports.up = function (knex) {
  return knex.schema.createTable("assets", (tbl) => {
    tbl.increments();
    tbl.string("asset_name", 255).notNullable();
    tbl.float("asset_value");
    tbl.text("asset_description");
    tbl.string("asset_type");
    tbl.boolean("gifted");
    tbl
      .integer("user_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("assets");
};
