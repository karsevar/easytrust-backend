const express = require("express");

// export authentication token function
const authenticateToken = require("../authRoute/authenticateMiddleware.js");

// database model function
const assetsDB = require("./assetsModel.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "base asset route is working." });
});

router.post("/addAssets", authenticateToken, (req, res) => {
  assetsDB
    .addAssets(req.body, req.user.userId)
    .then((results) => {
      res.status(201).json({
        message: "added new assets to assets table and ownership table",
        recordsLength: results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "unable to add to assets and ownership table",
        error: error,
      });
    });
});

router.get("/getAssetsByUserId", authenticateToken, (req, res) => {
  assetsDB
    .getAssetsByUser(req.user.userId)
    .then((results) => {
      res.status(200).json({
        message: `found user_id ${req.user.userId} assets in the database`,
        results: results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "unable to retrieve data from the database",
        error: error,
      });
    });
});

router.get("/getAssetsByOwner/:id", authenticateToken, (req, res) => {
  const relationshipId = req.params.id;

  assetsDB
    .getAssetsByRelationshipId(relationshipId)
    .then((results) => {
      res.status(200).json({
        message: `Was able to find asset for relationship_id ${relationshipId}`,
        assets: results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unable to retrieve data from database",
        error: error,
      });
    });
});

router.get("/getAllOwnershipAssets", (req, res) => {
  assetsDB
    .getAllOwnershipRecords()
    .then((results) => {
      res.status(200).json({
        results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong retrieving ownership records.",
        error: error,
      });
    });
});

module.exports = router;
