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
var corsOptions = {
  'origin': 'http://localhost:3000',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'optionsSuccessStatus': 200,
  'allowedHeaders': 'Access-Control-Allow-Origin'
}

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.get('Origin') || '*')
//   res.header('Access-Control-Allow-Credentials', 'true')
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
//   res.header('Access-Control-Expose-Headers', 'Content-Length')
//   res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Accept, Authorization, Content-Type, X-Requested-With, Range')
//   if (req.method === 'OPTIONS') {
//     console.log(req.method)
//     res.send(200)
//   } else {
//     return next()
//   }
// })

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())
// app.options('*', cors())
// app.use(cors())
app.get('/getUser',
  function (req, res, next) {
    if (req.user) {
      req.session.user = req.user
      console.log(req.user.username)
      setTimeout(() => {
        res.status(200).send(req.user)
      }, 100)
    } else {
      next()
    }
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

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.listen(process.env.PORT || 8080)
