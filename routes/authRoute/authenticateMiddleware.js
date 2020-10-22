const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JSON_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid credentials" });
      }

      req.user = { ...decodedToken };
      console.log("user credentials in the web token", req.user);
      next();
    });
  } else {
    res.status(401).json({
      message:
        "No credentials provided. Please login to access all the content.",
    });
  }
};
