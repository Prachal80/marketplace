//dependencies
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

var app = express();
var { frontend_url } = require("./config/config");

//setup port number
const PORT = 3001;

//routes
var orders = require("./orders/api");
var utils = require("./utility/api");

//session management
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({ origin: frontend_url, credentials: true }));
app.use(
  session({
    key: "glassdoor",
    secret: "cadence_takehome_assignment",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 6000000,
    },
  })
);

app.get("/", function (request, response) {
  response.send("Hello World!");
});

//routes
app.use("/orders", orders);
app.use("/utility", utils);

app.listen(PORT, function () {
  console.log("Started application on port %d", PORT);
});
