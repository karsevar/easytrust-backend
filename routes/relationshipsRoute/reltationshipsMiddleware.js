const relationshipsDB = require("./relationshipsModel.js");

function validateRelationshipPost(req, res, next) {
  // checks if the request body has the none nullable fields of
  // first_name and last_name.
  if (req.body.first_name && req.body.last_name) {
    // set that has all the expected fields for the relationships
    // table
    const relationshipFields = new Set([
      "user_id",
      "first_name",
      "middle_name",
      "last_name",
      "birthday",
      "relationship",
      "status",
      "parentage",
      "percentage",
      "city",
      "state",
      "relationship_title",
      "phone_number",
      "id",
    ]);

    // invalid field boolean
    let invalidField = false;
    for (const fieldKey in req.body) {
      if (relationshipFields.has(fieldKey) === false) {
        invalidField = true;
        break;
      }
    }

    if (invalidField) {
      res
        .status(401)
        .json({ message: "request body contained an invalid field." });
    } else {
      next();
    }
  } else {
    res.status(401).json({
      message:
        "Request body does not contain the first_name and last_name fields",
    });
  }
}

function validateMultiRelationshipPosts(req, res, next) {
  if (req.body.first_name && req.body.last_name) {
    // set that has all the expected fields for the relationships
    // table
    const relationshipFields = new Set([
      "user_id",
      "first_name",
      "middle_name",
      "last_name",
      "birthday",
      "relationship",
      "status",
      "parentage",
      "percentage",
      "city",
      "state",
      "relationship_title",
      "phone_number",
    ]);

    // invalid field boolean
    let invalidField = false;
    for (const fieldKey in req.body) {
      if (relationshipFields.has(fieldKey) === false) {
        invalidField = true;
        break;
      }
    }

    if (invalidField) {
      res
        .status(401)
        .json({ message: "request body contained an invalid field." });
    } else {
      next();
    }
  } else {
    res.status(401).json({
      message:
        "Request body does not contain the first_name and last_name fields",
    });
  }
}

module.exports = {
  validateRelationshipPost,
};
