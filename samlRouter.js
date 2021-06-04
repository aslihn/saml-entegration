require('dotenv').config();
const express = require('express')
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const SamlStrategy = require('passport-saml').Strategy;
var jwt = require('jsonwebtoken');

const router = express.Router();

mongoose.connect("mongodb://mongoadmin:secret@localhost:27888/userDB", {useNewUrlParser: true, useUnifiedTopology: true,
                "auth": { "authSource": "admin" },
                "user": "mongoadmin",
                "pass": "secret"});

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: Number
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// saml strategy for passport
passport.use(new SamlStrategy(
	{
		entryPoint: 'https://logintest.ford.com.tr/SAML/SSOService.aspx',
		issuer: 'BlockchainTest',
    cert: process.env.FORD_CERT,
		path: '/login/callback',
	},
	function(profile, cb){
		//console.log('Profile: %j', profile);
    User.findOrCreate({ email: profile.Mail }, function (err, user) {
      return cb(err, user);
    })
	})
);


router.get("/sendToken", async function(req, res){
  if (req.isAuthenticated()){
   
    res.send('Hello World!');
    console.log(req.user.email);
  } else {
    res.redirect("/login");
  }
});

router.get("/axious", function(req, res){
  res.send("Axios Post Request Succesfull");
});

router.post("/axious", function(req, res){
  res.send("Axios Post Request Succesfull");
});

router.get('/login',
  passport.authenticate('saml', {failureRedirect: '/login/fail', failureFlash: true }),
);

router.post('/login/callback',
  passport.authenticate('saml', {successRedirect: '/sendToken', failureRedirect: '/login/fail', failureFlash: true }),
  // async function(req, res, ){

  //   const email = req.user.email;
  //   console.log(email);

  //   const user = await User.findOne({email});
  //   if(!user){
  //       return res.status(422).send({error: 'Invalid email or password!'});
  //   }
   
  //   const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');    
  //   res.send({token});
  // }
  );

router.get('/login/fail', 
    function(req, res) {
        res.send(401, 'Login failed');
    }
);

 
module.exports = router;