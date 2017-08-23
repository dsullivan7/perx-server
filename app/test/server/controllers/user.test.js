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

describe('user model', () => {
  // test('should return the logged in user', async () => {
  //   await db.User.create({
  //     firstname: 'Firstname',
  //     lastname: 'Lastname',
  //     googleId: 'myGoogleId' })

  //   const res = await request(app).get('/api/users/me').set('Authorization', 'Bearer someToken')

  //   expect(res.statusCode).toBe(200)
  //   expect(res.body.firstname).toBe('Firstname')
  //   expect(res.body.lastname).toBe('Lastname')
  //   expect(res.body.Accounts.length).toBe(0)
  // })

  // test('should create and return the logged in user', async () => {
  //   const res = await request(app).get('/api/users/me').set('Authorization', 'Bearer someToken')

  //   expect(res.statusCode).toBe(200)
  //   expect(res.body.firstname).toBe('Daniel')
  //   expect(res.body.lastname).toBe('Sullivan')
  //   expect(res.body.Accounts.length).toBe(0)
  // })

  test('should get a user', async () => {
    const user = await db.User.create({ firstname: 'Firstname', lastname: 'Lastname' })
    const res = await request(app).get(`/api/users/${user.id}`).set('Authorization', 'Bearer someToken')

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.firstname).toBe('Firstname')
    expect(res.body.lastname).toBe('Lastname')
    expect(res.body.Accounts.length).toBe(0)
  })

  test('should create a user', async () => {
    const res = await request(app).post('/api/users').send({ firstname: 'Firstname', lastname: 'Lastname' }).set('Authorization', 'Bearer someToken')
    const user = await db.User.findById(res.body.id, { include: 'Accounts' })

    expect(res.statusCode).toBe(201)
    expect(res.type).toBe('application/json')
    expect(res.body.firstname).toBe('Firstname')
    expect(res.body.lastname).toBe('Lastname')
    expect(res.body.Accounts.length).toBe(0)
    expect(user.firstname).toBe('Firstname')
    expect(user.lastname).toBe('Lastname')
    expect(user.Accounts.length).toBe(0)
  })

  test('should list all users', async () => {
    await db.User.create({ firstname: 'Firstname1', lastname: 'Lastname1', googleId: 'myGoogleId' })
    await db.User.create({ firstname: 'Firstname2', lastname: 'Lastname2' })
    const res = await request(app).get('/api/users').set('Authorization', 'Bearer someToken')

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.length).toBe(2)
    expect(res.body[0].firstname).toBe('Firstname1')
    expect(res.body[0].lastname).toBe('Lastname1')
    expect(res.body[0].Accounts.length).toBe(0)
    expect(res.body[1].firstname).toBe('Firstname2')
    expect(res.body[1].lastname).toBe('Lastname2')
    expect(res.body[1].Accounts.length).toBe(0)
  })

  test('should modify a user', async () => {
    let user = await db.User.create({ firstname: 'Firstname1', lastname: 'Lastname1' })
    const res = await request(app).put(`/api/users/${user.id}`).send(
      {
        firstname: 'DifferentFirstname',
        lastname: 'DifferentLastname',
      })
      .set('Authorization', 'Bearer someToken')

    user = await db.User.findById(user.id)

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.firstname).toBe('DifferentFirstname')
    expect(res.body.lastname).toBe('DifferentLastname')
    expect(user.firstname).toBe('DifferentFirstname')
    expect(user.lastname).toBe('DifferentLastname')
  })

  test('should delete a user', async () => {
    const user = await db.User.create({ firstname: 'Firstname', lastname: 'Lastname' })
    const res = await request(app).delete(`/api/users/${user.id}`).set('Authorization', 'Bearer someToken')
    const foundUser = await db.User.findById(user.id)

    expect(res.statusCode).toBe(204)
    expect(foundUser).toBe(null)
  })
})
