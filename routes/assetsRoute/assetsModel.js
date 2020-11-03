const db = require("../../data/dbConfig.js");

function addAsset(asset) {
  return db("assets")
    .insert(asset, "id")
    .then((ids) => {
      const [id] = ids;
      return id;
    });
}

function addAssets(assets, user_id) {
  return db.transaction(function (trx) {
    return Promise.all(
      assets.map((asset) => {
        return trx
          .insert(
            {
              asset_name: asset.asset_name,
              asset_value: asset.asset_value,
              gifted: false,
              user_id: user_id,
            },
            "id"
          )
          .into("assets")
          .then((ids) => {
            return Promise.all(
              asset.ownership.map((ownerId) => {
                const assetOwner = {
                  relationship_id: ownerId,
                  asset_id: ids[0],
                };
                return trx("ownership").insert(assetOwner);
              })
            );
          });
      })
    );
  });
}

function getAssetsByUser(user_id) {
  return db("assets").where({ user_id: user_id });
}

function getAssetsByUserWithOwner(user_id) {
  return db("ownership as o")
    .join("assets as a", "o.asset_id", "a.id")
    .where({ user_id: user_id })
    .select(
      "o.asset_id",
      "a.gifted",
      "a.asset_name",
      "a.asset_value",
      "a.asset_description",
      "o.relationship_id"
    );
}

function getAssetsByRelationshipId(relationship_id) {
  return db("ownership as o")
    .where({ relationship_id: relationship_id })
    .join("assets as a", "o.asset_id", "a.id");
}

function getAllOwnershipRecords() {
  return db("ownership");
}

module.exports = {
  addAsset,
  addAssets,
  getAssetsByUser,
  getAssetsByRelationshipId,
  getAllOwnershipRecords,
  getAssetsByUserWithOwner,
};
