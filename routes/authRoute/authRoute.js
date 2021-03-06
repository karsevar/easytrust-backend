const express = require("express");
const bcrypt = require("bcryptjs");

// export authentication database functions
const userDB = require("./authModel.js");

// export authentication middleware
const userMiddleware = require("./authMiddleware.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "base auth route" });
});

router.post(
  "/registerTrial",
  userMiddleware.validateRegisterPost,
  (req, res) => {
    let userData = { email: req.body.email };

    userDB
      .addUser(userData)
      .then((saved) => {
        console.log("userId", saved);
        let relationshipData = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          relationship: "owner",
          user_id: saved,
        };

        userDB
          .addUserToRelationships(relationshipData)
          .then((relation_id) => {
            const token = userDB.generateToken({
              ...userData,
              ...relationshipData,
              id: saved,
              relationship_id: relation_id,
            });

            res.status(201).json({
              message: `User name: ${relationshipData.first_name} ${relationshipData.last_name} has been placed as a trial user.`,
              token,
              id: saved,
              relationship_id: relation_id,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "unable to add user information to relationships table",
              error: error,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          message: "a problem happened when adding the user",
          error: error,
        });
      });
  }
);

router.post("/register", userMiddleware.validateRegisterPost, (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  userDB
    .addUser(user)
    .then((saved) => {
      res.status(201).json({
        message: `User name: ${user.first_name} ${user.last_name} has been saved to the database`,
        id: saved,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/login", userMiddleware.validateLoginPost, (req, res) => {
  let user = req.body;

  // The following function finds the user's information in the database.
  userDB
    .findUserByEmail(user)
    .then((userInfo) => {
      if (user && bcrypt.compareSync(user.password, userInfo.password)) {
        const token = userDB.generateToken(userInfo);

        res.status(200).json({
          message: `${userInfo.first_name} ${userInfo.last_name} is logged in`,
          token,
          userObject: {
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            id: userInfo.id,
          },
        });
      } else {
        res.status(401).json({ message: "invalid email or password" });
      }
    })

    .catch((error) => {
      res
        .status(500)
        .json({ message: `There was an error logging in: ${error}` });
    });
});

module.exports = router;
