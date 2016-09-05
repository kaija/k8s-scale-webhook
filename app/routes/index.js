var express = require('express');
var router = express.Router();
router.all('/', function(req, res, next) {
  res.send("OK");
});

module.exports = router;
