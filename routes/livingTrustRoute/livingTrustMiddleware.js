const trustDB = require("./livingTrustModel.js");

function checkIfTrustExists(req, res, next) {
  console.log("decoded token payload", req.user);

  // uses the trustDB.findTrustByUserId function to check if the
  // trust for the specific logged user exists in the database
  // if false a new trust is created using the logged in user's Id.

  trustDB
    .findTrustByUserId(req.user.userId)
    .then((results) => {
      // checks if the trusts record exists for the logged in user.
      if (results) {
        // creates a new req instance that will carry the old living trust state
        // in the database.
        req.oldTrust = results;
        next();

        // if the living trust record does not exists for the logged in user
        // a new trust will be created.
      } else {
        const emptyTrust = {
          user_id: req.user.userId,
        };
        trustDB
          .addTrust(emptyTrust)
          .then((results) => {
            next();
          })
          .catch((error) => {
            res.status(500).json({
              message: "Error occurred upon creating a new trust record.",
              error: error,
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error ocurred upon finding if a trust record exists",
        error: error,
      });
    });
}

function validateTrustUpdate(req, res, next) {
  // All the valid fields in the living_trust table
  // if an input in the req.body doesn't match with the
  // names in this set an error will be passed.
  const validateTrustFields = new Set([
    "id",
    "user_id",
    "living_a",
    "living_b",
    "living_c",
    "living_d",
    "living_e",
    "living_f",
    "living_g",
    "living_h",
    "living_i",
    "living_j",
  ]);

  // iterates over the req.body dictionary and returns a res.status if a key
  // in req.body does not match will the validateTrustFields set.

  // It seems that res doesn't like being placed in a for loop boolean logic
  // to bypass the headers from being reset in the for loop.
  let invalidInput = false;
  for (const trustKey in req.body) {
    if (validateTrustFields.has(trustKey) === false) {
      invalidInput = true;
      break;
    }
  }

  if (invalidInput) {
    res.status(401).json({ message: "invalid put argument in request body." });
  } else {
    // create a new req object key with a combination of the edited values from the user
    // and the old database state.
    req.updatedTrust = { ...req.oldTrust, ...req.body };
    next();
  }
}

function convertToBoolean(req, res, next) {
  // the following middleware changes the 1 and 0 values from the database
  // into true or false values.

  // boolean fields in the database:
  const booleanFields = new Set([
    "living_a",
    "living_b",
    "living_c",
    "living_i",
  ]);

  for (const fieldKey in req.oldTrust) {
    if (booleanFields.has(fieldKey) && req.oldTrust[fieldKey] !== null) {
      if (req.oldTrust[fieldKey] === 0) {
        req.oldTrust[fieldKey] = false;
      } else {
        req.oldTrust[fieldKey] = true;
      }
    }
  }

  next();
}

module.exports = {
  checkIfTrustExists,
  validateTrustUpdate,
  convertToBoolean,
};
