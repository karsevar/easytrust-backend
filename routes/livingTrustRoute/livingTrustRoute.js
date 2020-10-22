const express = require("express");

// living trust middleware
const trustMiddleware = require("./livingTrustMiddleware.js");

// database model function
const trustDB = require("./livingTrustModel.js");

// web token authentication middleware
const authenticateToken = require("../authRoute/authenticateMiddleware.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "base living trust route." });
});

router.get(
  "/getUserTrust",
  authenticateToken,
  trustMiddleware.checkIfTrustExists,
  trustMiddleware.convertToBoolean,
  (req, res) => {
    res.status(200).json({
      message: `User id ${req.user.userId} trust found.`,
      currentTrust: req.oldTrust,
    });
  }
);

router.put(
  "/updateTrust",
  authenticateToken,
  trustMiddleware.checkIfTrustExists,
  trustMiddleware.convertToBoolean,
  trustMiddleware.validateTrustUpdate,
  (req, res) => {
    trustDB
      .editTrustByUserId(req.user.userId, req.updatedTrust)
      .then((results) => {
        console.log("updated trust", results);
        res.status(201).json({
          message: `trust id ${req.updatedTrust.id} has been updated.`,
          currentTrust: req.updatedTrust,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Error occurred upon editing a record in living_trusts table.",
          error: error,
        });
      });
  }
);

module.exports = router;
