import 'babel-polyfill'
import path from 'path'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'

import routes from './server/routes'


// Set up the express app
const app = express()

// Log requests to the console.
app.use(logger('dev'))

// Parse incoming requests data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Must go after the bodyParser
app.use(expressValidator({ customValidators:
  {
    validName: val => new RegExp(/^[A-Z][a-z,-]{3,}$/).test(val),
  },
}))

// Inject our routes into the application.
app.use('/api', routes)

app.use(express.static(path.join(__dirname, 'public')))

// Default Route
app.get('*', (req, res) => res.status(200).send({
  message: 'Bank Server',
}))

module.exports = app
