const { table } = require("../dbConfig");

exports.up = function (knex) {
  return knex.schema.createTable("living_trusts", (tbl) => {
    tbl.increments();
    tbl
      .integer("user_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.boolean("living_a");
    tbl.boolean("living_b");
    tbl.boolean("living_c");
    tbl.text("living_d");
    tbl.text("living_e");
    tbl.text("living_f");
    tbl.text("living_g");
    tbl.text("living_h");
    tbl.boolean("living_i");
    tbl.string("living_j", 255);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("living_trusts");
};
