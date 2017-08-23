/* eslint-env node, jest */

import request from 'supertest'
import Umzug from 'umzug'
import db from '../../../server/models'
import app from '../../../app'

const umzug = new Umzug({
  storage: 'sequelize',

  storageOptions: {
    sequelize: db.sequelize,
  },

  migrations: { path: 'app/server/migrations', params: [db.sequelize.getQueryInterface(), db.Sequelize] },
})

jest.mock('../../../server/utils/googleUtils', () =>
  ({
    verifyToken: jest.fn().mockReturnValue(
      Promise.resolve(require('../../resources/googlePayload').default), // eslint-disable-line global-require
    ),
  }))

beforeAll(async () => {
  await db.sequelize.drop()
})

beforeEach(async () => {
  // excutes migrations
  await umzug.up()
})

afterEach(async () => {
  await db.sequelize.drop()
})

describe('account model', () => {
  test('should get an account', async () => {
    const account = await db.Account.create({ currency: 'USD', balance: 1234.67 })
    const res = await request(app).get(`/api/accounts/${account.id}`).set('Authorization', 'Bearer someToken')

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.currency).toBe('USD')
    expect(res.body.balance).toBe(1234.67)
  })

  test('should create a account', async () => {
    const res = await request(app).post('/api/accounts').send({ currency: 'USD', balance: 1234.67 }).set('Authorization', 'Bearer someToken')
    const account = await db.Account.findById(res.body.id)

    expect(res.statusCode).toBe(201)
    expect(res.type).toBe('application/json')
    expect(res.body.currency).toBe('USD')
    expect(res.body.balance).toBe(1234.67)
    expect(account.currency).toBe('USD')
    expect(account.balance).toBe(1234.67)
  })

  test('should create an account for a user account', async () => {
    const user = await db.User.create({ firstname: 'Blah', lastname: 'Blahdy' })
    const res = await request(app).post('/api/accounts').send({ currency: 'USD', balance: 1234.67, Users: [user.id] }).set('Authorization', 'Bearer someToken')
    const account = await db.Account.findById(res.body.id)
    const userWithAccount = await db.User.findById(user.id)

    const userAccounts = await userWithAccount.getAccounts()
    const accountUsers = await account.getUsers()

    expect(res.statusCode).toBe(201)
    expect(res.type).toBe('application/json')
    expect(res.body.currency).toBe('USD')
    expect(res.body.balance).toBe(1234.67)
    expect(res.body.Users[0].id).toBe(user.id)
    expect(res.body.Users[0].UserAccount.AccountId).toBe(account.id)
    expect(res.body.Users[0].UserAccount.UserId).toBe(user.id)

    expect(account.currency).toBe('USD')
    expect(account.balance).toBe(1234.67)
    expect(accountUsers[0].id).toBe(user.id)
    expect(userAccounts[0].id).toBe(account.id)
  })

  test('should list all accounts', async () => {
    await db.Account.create({ currency: 'USD', balance: 1234.56 })
    await db.Account.create({ currency: 'EUR', balance: 789.10 })
    const res = await request(app).get('/api/accounts').set('Authorization', 'Bearer someToken')

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.length).toBe(2)
    expect(res.body[0].currency).toBe('USD')
    expect(res.body[0].balance).toBe(1234.56)
    expect(res.body[1].currency).toBe('EUR')
    expect(res.body[1].balance).toBe(789.10)
  })

  test('should modify an account', async () => {
    let account = await db.Account.create({ currency: 'USD', balance: 1234.67 })
    const res = await request(app).put(`/api/accounts/${account.id}`).send(
      {
        currency: 'EUR',
        balance: 789.10,
      })
      .set('Authorization', 'Bearer someToken')

    account = await db.Account.findById(account.id)

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.currency).toBe('EUR')
    expect(res.body.balance).toBe(789.10)
    expect(account.currency).toBe('EUR')
    expect(account.balance).toBe(789.10)
  })

  test('should modify an account to add a user', async () => {
    const user1 = await db.User.create({ firstname: 'Blah1', lastname: 'Blahdy1' })
    const user2 = await db.User.create({ firstname: 'Blah2', lastname: 'Blahdy2' })
    const account = await db.Account.create({ currency: 'USD', balance: 1234.56 })
    const res = await request(app).put(`/api/accounts/${account.id}`).send(
      {
        currency: 'EUR',
        balance: 789.10,
        Users: { add: [user1.id, user2.id] },
      })
      .set('Authorization', 'Bearer someToken')

    const updatedAccount = await db.Account.findById(account.id, { include: 'Users' })
    const account1 = await user1.getAccounts()
    const account2 = await user2.getAccounts()

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.currency).toBe('EUR')
    expect(res.body.balance).toBe(789.10)
    expect(updatedAccount.currency).toBe('EUR')
    expect(updatedAccount.balance).toBe(789.10)
    expect(updatedAccount.Users[0].id).toBe(user1.id)
    expect(updatedAccount.Users[1].id).toBe(user2.id)
    expect(account1[0].id).toBe(account.id)
    expect(account2[0].id).toBe(account.id)
  })

  test('should modify an account to remove a user', async () => {
    const user1 = await db.User.create({ firstname: 'Blah1', lastname: 'Blahdy1' })
    const user2 = await db.User.create({ firstname: 'Blah2', lastname: 'Blahdy2' })
    const account = await db.Account.create({ currency: 'USD', balance: 1234.56 })
    await account.addUsers([user1, user2])
    const res = await request(app).put(`/api/accounts/${account.id}`).send(
      {
        currency: 'EUR',
        balance: 789.10,
        Users: { remove: [user2.id] },
      })
      .set('Authorization', 'Bearer someToken')

    const updatedAccount = await db.Account.findById(account.id, { include: 'Users' })
    const account1 = await user1.getAccounts()
    const account2 = await user2.getAccounts()

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.currency).toBe('EUR')
    expect(res.body.balance).toBe(789.10)
    expect(updatedAccount.currency).toBe('EUR')
    expect(updatedAccount.balance).toBe(789.10)
    expect(updatedAccount.Users[0].id).toBe(user1.id)
    expect(updatedAccount.Users.length).toBe(1)
    expect(account1[0].id).toBe(account.id)
    expect(account2.length).toBe(0)
  })

  test('should delete a account', async () => {
    const account = await db.Account.create({ currency: 'USD', balance: 1000.00 })
    const res = await request(app).delete(`/api/accounts/${account.id}`).set('Authorization', 'Bearer someToken')
    const foundAccount = await db.Account.findById(account.id)

    expect(res.statusCode).toBe(204)
    expect(foundAccount).toBe(null)
  })
})
