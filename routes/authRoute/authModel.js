const db = require("../../data/dbConfig.js");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    relationshipId: user.relationship_id,
  };

  const secret = process.env.JSON_SECRET;

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

function addUserAsRelationship(user) {
  return db("relationships")
    .insert(user, "id")
    .then((ids) => {
      const [id] = ids;
      return id;
    });
}

function addUser(user) {
  return db("users")
    .insert(user, "id")
    .then((ids) => {
      const [id] = ids;
      return id;
    });
}

function addUserToRelationships(user) {
  return db("relationships")
    .insert(user, "id")
    .then((ids) => {
      const [id] = ids;
      return id;
    });
}

function findUserByEmail(user) {
  return db("users").where({ email: user.email }).first();
}

module.exports = {
  generateToken,
  addUser,
  addUserToRelationships,
  findUserByEmail,
  addUserAsRelationship,
};
