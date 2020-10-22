const express = require("express");

// authentication token middleware (needed to find the user_id of the logged in user)
const authenticateToken = require("../authRoute/authenticateMiddleware.js");

// relationships route middleware
const relationshipsMiddleware = require("./reltationshipsMiddleware.js");

// export database model functions
const relationshipsDB = require("./relationshipsModel.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "base relationships route is working!" });
});

router.get("/allUserRelationships", authenticateToken, (req, res) => {
  console.log("getAllUserRelationships route", req.user.userId);
  relationshipsDB
    .getAllUserRelationships(req.user.userId)
    .then((results) => {
      res.status(200).json({
        message: `Found user id ${req.user.userId} relationships.`,
        data: results,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error retrieving user relationships" });
    });
});

router.post(
  "/addUserRelationship",
  authenticateToken,
  relationshipsMiddleware.validateRelationshipPost,
  (req, res) => {
    // don't forget to add the user_id to the post request body.
    // console.log("addUserRelationship route", req.user);
    req.body.user_id = req.user.userId;

    relationshipsDB
      .addRelationship(req.body)
      .then((results) => {
        // res.status(201).json({
        //   message: `User id ${req.user.userId} relationship has been added`,
        //   relationshipId: results,
        // });
        relationshipsDB
          .getRelationById(results)
          .then((results) => {
            res.status(201).json({
              message: `User id ${req.user.userId} relationship has been added`,
              relationshipCreated: results,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "unable to find newly created relationship",
              error: error,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          message: "unable to add record to relationships table",
          error: error,
        });
      });
  }
);

router.post("/addMultipleUserRelationships", authenticateToken, (req, res) => {
  // make sure to add the user_id of the logged in user to all the
  // records in post request.

  req.body.forEach((record) => {
    record.user_id = req.user.userId;
  });

  relationshipsDB
    .addRelationships(req.body)
    .then((results) => {
      relationshipsDB
        .getAllUserRelationships(req.user.userId)
        .then((results) => {
          res.status(201).json({
            message: `User id ${req.user.userId} relationship has been added`,
            relationships: results,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "unable to retrieve user relationships",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "unable to add record to relationships table",
        error: error,
      });
    });
});

router.get("/getUserSpouse", authenticateToken, (req, res) => {
  relationshipsDB
    .getUserSpouse(req.user.userId)
    .then((results) => {
      res.status(200).json({
        message: `Found user id ${req.user.userId} spouse`,
        data: results,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Error upon reading from relationships table",
        error: error,
      });
    });
});

router.put(
  "/updateRelationshipById",
  authenticateToken,
  relationshipsMiddleware.validateRelationshipPost,
  (req, res) => {
    relationshipsDB
      .editRelationById(req.body.id, req.body)
      .then((results) => {
        relationshipsDB
          .getUserSpouse(req.user.userId)
          .then((results) => {
            res.status(201).json({
              message: `Spouse for user id ${req.user.userId} has been modified`,
              spouseInfo: results,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Unable to get back spouse information from database",
              error: error,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          message: "unable to update spouse information",
          error: error,
        });
      });
  }
);

router.get("/getUserChildren", authenticateToken, (req, res) => {
  relationshipsDB
    .getUserChildren(req.user.userId)
    .then((results) => {
      res.status(200).json({
        message: `Found user id ${req.user.userId} children.`,
        data: results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error upon reading from relationships table",
        error: error,
      });
    });
});

module.exports = router;
