exports.up = function (knex) {
  return knex.schema.createTable("users", (tbl) => {
    tbl.increments();
    tbl.string("email", 255).notNullable().unique();
    tbl.string("password", 300);
    tbl.string("first_name", 255).notNullable();
    tbl.string("middle_name", 255);
    tbl.string("last_name", 255).notNullable();
    tbl.string("birthday", 255);
    tbl.string("phone_number", 255);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
