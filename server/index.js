var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");

var Filter = require("bad-words");

const app = express();
const rateLimit = require("express-request-limit");
require('dotenv').load();


var filter = new Filter();

const rateLimitOpts = {
  timeout: 1000 * 1,
  exactPath: true,
  cleanUpInterval: 0,
  errStatusCode: 429,
  errMessage: "Too many requests made to this route."
};

const db = process.env.MONGODB_URI;


mongoose.connect(db, { useNewUrlParser: true });

var schema = new mongoose.Schema({
  name: String,
  twizz: String,
  time: { type: Date, default: new Date().toISOString() },
  url: String
});

var twizz = mongoose.model("twizz", schema);

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ Hello: "😎" });
});

app.get("/twizz", function (req, res) {
  twizz.find({}, function (err, data) {
    res.json(data);
  });
});

function validate(res) {
  console.log(res.name.length);
  if (
    res.name &&
    res.name.trim() != "" &&
    res.name.length < 15 &&
    (res.twizz && res.twizz.trim() != "")
  ) {
    return true;
  }
  return false;
}

app.post("/twizz", rateLimit(rateLimitOpts), function (req, res) {
  req.body.name = filter.clean(req.body.name);
  req.body.twizz = filter.clean(req.body.twizz);

  if (validate(req.body)) {
    var new_twizz = twizz(req.body).save(function (err, data) {
      if (err) throw err;
    });
    res.json(null);
    //res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

app.listen(process.env.PORT || 5000);
