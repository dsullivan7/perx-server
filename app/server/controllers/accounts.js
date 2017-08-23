import models from '../models'

const Account = models.Account

const create = async (req, res) => {
  const userIds = req.body.Users

  try {
    let account = await Account.create({
      currency: req.body.currency,
      balance: req.body.balance,
    })

    if (userIds) {
      // add the userIds to the newly created account
      await account.addUsers(userIds)
      account = await Account.findById(account.id, { include: 'Users' })
    }
    res.status(201).send(account)
  } catch (error) {
    res.status(400).send(error)
  }
}

const list = (req, res) => {
  const query = req.query.query || {}

  Account.findAll(query)
    .then(accounts => res.status(200).send(accounts))
    .catch(error => res.status(400).send(error))
}

const retrieve = (req, res) => {
  Account.findById(req.params.accountId).then((account) => {
    if (!account) {
      res.status(404).send({
        message: 'Account Not Found',
      })
    } else {
      res.status(200).send(account)
    }
  }).catch(error => res.status(400).send(error))
  return null
}

const update = async (req, res) => {
  const userIdsAdd = req.body.Users && req.body.Users.add
  const userIdsRemove = req.body.Users && req.body.Users.remove

  try {
    let account = await Account.findById(req.params.accountId)
    if (!account) {
      res.status(404).send({
        message: 'Account Not Found',
      })
    } else {
      // add/remove users if necessary
      if (userIdsAdd || userIdsRemove) {
        if (userIdsAdd) {
          await account.addUsers(userIdsAdd)
        }
        if (userIdsRemove) {
          await account.removeUsers(userIdsRemove)
        }
        account = await Account.findById(account.id, { include: 'Users' })
      }

      await account.update({
        balance: req.body.balance || account.balance,
        currency: req.body.currency || account.currency,
      })

      res.status(200).send(account)
    }
  } catch (error) {
    res.status(400).send(error)
  }
}

const destroy = (req, res) =>
  Account.findById(req.params.accountId)
    .then((account) => {
      if (!account) {
        res.status(400).send({
          message: 'Account Not Found',
        })
      } else {
        account.destroy()
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
