require('dotenv').config();
const path = require('path');
const  fs = require('fs');
const express = require('express')
const session = require('express-session');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

var userProfile;
var app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

// saml strategy for passport
passport.use(new SamlStrategy(
	{
		entryPoint: 'https://logintest.ford.com.tr/SAML/SSOService.aspx',
		issuer: 'BlockchainTest',
    cert: process.env.FORD_CERT,
		path: '/login/callback',
	},
	function(profile, done){
		console.log('Profile: %j', profile);
		return done(null, profile);
	})
);


app.get('/', 
    /*passport.authenticate('saml', {failureRedirect: '/login/fail'}), */
    function(req, res) {
        res.send('Hello World!');
    }
);

app.get('/login',
  passport.authenticate('saml', { successRedirect: '/', failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/login/fail', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/login/fail', 
    function(req, res) {
        res.send(401, 'Login failed');
    }
);

 
app.listen(3001, () => {
  console.log("Server startted at http://localhost:3001")
});