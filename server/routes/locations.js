// routes/locations.js
const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

router.get("/", async (req, res) => {
  const data = await Location.find();
  res.json(data);
});

module.exports = router;
