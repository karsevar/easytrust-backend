const db = require("../../data/dbConfig.js");

function addTrust(trust) {
  return db("living_trusts")
    .insert(trust, "id")
    .then((ids) => {
      const [id] = ids;
      return id;
    });
}

function findTrustByUserId(userId) {
  return db("living_trusts").where({ user_id: userId }).first();
}

function findTrustByTrustId(trustId) {
  return db("living_trusts").where({ id: trustId }).first();
}

function editTrustByTrustId(trustId, updatedTrust) {
  return db("living_trusts").where({ id: trustId }).update(updatedTrust);
}

function editTrustByUserId(userId, updatedTrust) {
  return db("living_trusts").where({ user_id: userId }).update(updatedTrust);
}

module.exports = {
  addTrust,
  findTrustByUserId,
  findTrustByTrustId,
  editTrustByTrustId,
  editTrustByUserId,
};
