const db = require("../../data/dbConfig.js");

function addRelationship(relationship) {
  return db("relationships")
    .insert(relationship, "id")
    .then((ids) => {
      const [id] = ids;
      return id;
    });
}

function addRelationships(relationship) {
  return db("relationships")
    .insert(relationship, "id")
    .then((ids) => {
      return ids;
    });
}

function editRelationById(relationshipId, relationship) {
  return db("relationships").where({ id: relationshipId }).update(relationship);
}

function getRelationById(relationshipId) {
  return db("relationships").where({ id: relationshipId }).first();
}

function getAllUserRelationships(userId) {
  return db("relationships").where({ user_id: userId });
}

function getUserSpouse(userId) {
  return db("relationships")
    .where({ user_id: userId, relationship: "spouse" })
    .first();
}

function getUserChildren(userId) {
  return db("relationships")
    .where({ user_id: userId, relationship: "son" })
    .orWhere({ user_id: userId, relationship: "daughter" });
}

function updateRelationById(relationshipId, updatedRelationship) {
  return db("relationships")
    .where({ id: relationshipId })
    .update(updatedRelationship);
}

module.exports = {
  addRelationship,
  addRelationships,
  getAllUserRelationships,
  getUserSpouse,
  getUserChildren,
  getRelationById,
  editRelationById,
  updateRelationById,
};
