const usersDB = require("./authModel.js");

function validateRegisterPost(req, res, next) {
  if (Object.keys(req.body).length > 0) {
    const registerPost = req.body;

    if (
      registerPost.email &&
      registerPost.first_name &&
      registerPost.last_name
    ) {
      usersDB
        .findUserByEmail(registerPost)
        .then((results) => {
          if (results) {
            res.status(401).json({
              message: `The email ${results.email} is already taken.`,
            });
          } else {
            next();
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: "Database error retrieving user information.",
            error: error,
          });
        });
    } else {
      res.status(401).json({
        message:
          "missing either email, first_name, or last_name within post request.",
      });
    }
  } else {
    res.status(401).json({ message: "missing request body" });
  }
}

function validateLoginPost(req, res, next) {
  if (Object.keys(req.body).length > 0) {
    const registerPost = req.body;

    if (registerPost.email) {
      next();
    } else {
      res.status(401).json({
        message: "missing either the password or email in the request body.",
      });
    }
  } else {
    res.status(401).json({ message: "missing request body." });
  }
}

module.exports = {
  validateRegisterPost,
  validateLoginPost,
};
