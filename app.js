require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);




app.get("/", function(req, res) {
  res.render("home");
});

/////////////////////// route login ///////////////////////////

app.route("/login")
  .get(function(req, res) {
    res.render("login");
  })
  .post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
      email: username
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result === true) {
              res.render("secrets");
            }
          });
        }
      }
    });
  });

/////////////////////// route register ////////////////////////

app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });

      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    });

  });


app.listen(3000, function() {
  console.log("Server running on Port 3000");
});
