const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// route imports
const authRoute = require("../routes/authRoute/authRoute.js");
const livingTrustRoute = require("../routes/livingTrustRoute/livingTrustRoute.js");
const relationshipsRoute = require("../routes/relationshipsRoute/relationshipsRoute.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/livingTrust", livingTrustRoute);
server.use("/relationships", relationshipsRoute);
server.use("/auth", authRoute);
server.use;

server.get("/", (req, res) => {
  res.status(200).json({ message: "hello world from base server" });
});

module.exports = server;
