import models from '../models'

const User = models.User

const create = (req, res) =>
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  })
    .then(user => res.status(201).send(user))
    .catch(error => res.status(400).send(error))

const list = (req, res) => {
  const query = Object.assign({}, req.query.query, { order: [['createdAt', 'ASC']] })

  User.findAll(query)
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).send(error))
}

const retrieve = (req, res) => {
  // check to see if we are looking for the currently logged on user
  if (req.params.userId === 'me') {
    res.status(200).send(res.locals.user)
    return null
  }

  User.findById(req.params.id).then((user) => {
    if (!user) {
      res.status(404).send({
        message: 'User Not Found',
      })
    } else {
      res.status(200).send(user)
    }
  }).catch(error => res.status(400).send(error))
  return null
}

const update = (req, res) =>
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'User Not Found',
        })
      } else {
        user.update({
          firstName: req.body.firstName || user.firstName,
          lastName: req.body.lastName || user.lastName,
        })
          .then(() => res.status(200).send(user))
          .catch(error => res.status(400).send(error))
      }
    })
    .catch(error => res.status(400).send(error))

const destroy = (req, res) =>
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(400).send({
          message: 'User Not Found',
        })
      } else {
        user.destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error))
      }
    })
    .catch(error => res.status(400).send(error))

module.exports = {
  create,
  list,
  retrieve,
  update,
  destroy,
}
