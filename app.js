const express = require("express");
const path = require("path");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.engine("jade", require("pug").__express);
app.get("/", function (req, res) {
  res.render("overview");
});

app.use(express.static(path.join(`${__dirname}/public`)));

module.exports = app;
