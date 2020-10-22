exports.up = function (knex) {
  return knex.schema.createTable("relationships", (tbl) => {
    tbl.increments();
    tbl
      .integer("user_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.string("first_name", 255).notNullable();
    tbl.string("middle_name", 255);
    tbl.string("last_name", 255).notNullable();
    tbl.string("birthday", 255);
    tbl.string("relationship", 255);
    tbl.string("status", 255);
    tbl.text("parentage");
    tbl.float("percentage");
    tbl.string("city", 255);
    tbl.string("state", 255);
    tbl.text("relationship_title");
    tbl.string("phone_number", 255);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("relationships");
};
