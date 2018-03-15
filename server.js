var express = require('express')
var cors = require('cors')
var passport = require('passport')
var Strategy = require('passport-twitter').Strategy
require('dotenv').config()
passport.use(new Strategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: 'http://localhost:8080/login/return'
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

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())

app.get('/getUser', cors({credentials: true, origin: 'http://localhost:3000'}),
  function (req, res, next) {
    res.status(200).send(req.user)
  }
)

app.get('/login',
  passport.authenticate('twitter'),
  function (req, res) {
  })

app.get('/login/return',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    // res.json(req.user)
    res.redirect('http://localhost:3000')
  })

// app.options('*', cors())

// app.get('/logout', cors({credentials: true, origin: 'http://localhost:3000'}),
//   function (req, res) {
//     console.log('hello')
//   }
// )
app.get('/logout', cors({credentials: true, origin: 'http://localhost:3000'}),
  function (req, res) {
    req.logout()
    res.redirect('/')
  })

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.listen(process.env.PORT || 8080)
