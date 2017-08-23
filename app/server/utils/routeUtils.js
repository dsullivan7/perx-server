import models from '../models'
import googleUtils from './googleUtils'

const User = models.User

const verifyToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.token

  // decode token
  if (token) {
    // verify secret with google
    googleUtils.verifyToken(token)
    .then((payload) => {
      res.locals.googlePayload = payload
      next()
    })
    .catch((err) => {
      console.error(err)
      res.status(403).send({ message: 'Failed to authenticate token' })
    })
  } else {
    res.status(403).send({ message: 'No token provided' })
  }
}

const getUser = (req, res, next) => {
  User.findOrCreate({ where: { googleId: res.locals.googlePayload.sub }, include: 'Accounts' })
    .spread((user, created) => {
      res.locals.user = user
      if (created) {
        return user.update(
          {
            firstname: res.locals.googlePayload.given_name,
            lastname: res.locals.googlePayload.family_name,
            Accounts: [],
          }, { include: 'Accounts' }).then(() => next())
      }
      return next()
    })
    .catch((err) => {
      console.error('Error creating the user')
      console.error(err)
      res.status(500).send({ message: 'An error occured while creating the user.' })
    })
}

module.exports = {
  verifyToken,
  getUser,
}
