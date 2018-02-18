var express = require('express')
var cors = require('cors')
var passport = require('passport')
var Strategy = require('passport-twitter').Strategy
require('dotenv').config()
passport.use(new Strategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: 'https://vast-coast-12235.herokuapp.com/login/return'
},
function (token, tokenSecret, profile, cb) {
  return cb(null, profile)
}))

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
  cb(null, obj)
})

var app = express()
app.use(cors())

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())

app.get('/',
  function (req, res, next) {
    res.send(req.user)
  }
)

app.get('/login',
  passport.authenticate('twitter'),
  function (req, res) {
  })

app.get('/login/return',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    console.log(req.params)
    // res.json(req.user)
    res.redirect('http://localhost:3000')
  })

app.listen(process.env.PORT || 8080)
