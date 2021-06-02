var express = require("express");
var router = express.Router();
var connection = require("../config/db_config").connection;

//function to fetch query results
get_query = (table_name, req, res) => {
  var sql = `select * from ${table_name}`;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(400).end("Bad Request");
    } else {
      res.status(200).send(results);
    }
  });
};

//get all units
router.get("/units", (req, res) => {
  get_query("units", req, res);
});

router.get("/priorities", (req, res) => {
  get_query("priority", req, res);
});

router.get("/locations", (req, res) => {
  get_query("location", req, res);
});

router.get("/channels", (req, res) => {
  get_query("sales_channel", req, res);
});

module.exports = router;
