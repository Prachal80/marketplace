var express = require("express");
var router = express.Router();
var connection = require("../config/db_config").connection;

//create order
router.post("/", (req, res) => {
  var orderDate = new Date(Date.now()).toLocaleString().split(",")[0];
  var type = req.body.type;
  var noOfUnits = req.body.noOfUnits;
  var shipDate = req.body.shipDate;
  var priority = req.body.priority;
  var channel = req.body.channel;
  var location = req.body.location;

  var sql = `insert into orders(order_date, shipping_date, unit, units_sold, priority, channel, location) values(?,?,?,?,?,?,?)`;
  var values = [
    orderDate,
    shipDate,
    type,
    noOfUnits,
    priority,
    channel,
    location,
  ];
  connection.query(sql, values, (err, results) => {
    if (err) {
      res.status(400).end("Bad Request");
    } else {
      var orderDetails = {
        orderID: results.insertId,
      };
      orderDetails = { ...orderDetails, ...req.body };
      res.status(200).send(orderDetails);
    }
  });
});

//get all orders
router.get("/", (req, res) => {
  var sql = `select o.id, o.order_date, o.shipping_date , o.unit, o.units_sold , u.price, u.cost, l.country, l.region, p.priority, s.channel,
  (ROUND(o.units_sold*u.price, 2)) as revenue, (ROUND(o.units_sold * u.cost, 2)) as cost, ( (ROUND(o.units_sold*u.price, 2)) - (ROUND(o.units_sold * u.cost, 2)) ) as profit
  from orders o inner join units u on u.type = o.unit inner join location l on o.location = l.id inner join priority p on o.priority = p.id 
  inner join sales_channel s on o.channel = s.id `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(400).end("Error");
    } else {
      console.log("Fetching orders");
      res.status(200).send(results);
    }
  });
});

//update order by order id
router.put("/", (req, res) => {
  var orderID = req.query.id;
  var type = req.body.type;
  var noOfUnits = req.body.noOfUnits;
  var shipDate = req.body.shipDate;
  var priority = req.body.priority;
  var channel = req.body.channel;
  var location = req.body.location;

  var sql = `update orders set shipping_date=?, unit=?, units_sold=?, priority=?, channel=?, location=? where id=?`;
  var values = [
    shipDate,
    type,
    noOfUnits,
    priority,
    channel,
    location,
    orderID,
  ];

  connection.query(sql, values, (err, results) => {
    if (err) {
      res.status(400).end("Bad Request");
    } else {
      req.body.orderID = orderID;
      res.status(200).send(req.body);
    }
  });
});

//delete order by order id
router.delete("/", (req, res) => {
  var orderID = req.query.id;

  var sql = `delete from orders where id=?`;
  var values = [orderID];

  connection.query(sql, values, (err, results) => {
    if (err) {
      res.status(400).end("Bad Request");
    } else {
      res.status(204).send();
    }
  });
});

module.exports = router;
