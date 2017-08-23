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
  //     firstName: 'Firstname',
  //     lastName: 'Lastname',
  //     googleId: 'myGoogleId' })

  //   const res = await request(app).get('/api/users/me').set('Authorization', 'Bearer someToken')

  //   expect(res.statusCode).toBe(200)
  //   expect(res.body.firstName).toBe('Firstname')
  //   expect(res.body.lastName).toBe('Lastname')
  // })

  // test('should create and return the logged in user', async () => {
  //   const res = await request(app).get('/api/users/me').set('Authorization', 'Bearer someToken')

  //   expect(res.statusCode).toBe(200)
  //   expect(res.body.firstName).toBe('Daniel')
  //   expect(res.body.lastName).toBe('Sullivan')
  // })

  test('should get a user', async () => {
    const user = await db.User.create({ firstName: 'Firstname', lastName: 'Lastname' })
    const res = await request(app).get(`/api/users/${user.id}`).set('Authorization', 'Bearer someToken')

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.firstName).toBe('Firstname')
    expect(res.body.lastName).toBe('Lastname')
  })

  test('firstname validation check', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'asdf', lastName: 'Lastname' }).set('Authorization', 'Bearer someToken')
    expect(res.statusCode).toBe(400)
  })

  test('lastname validation check', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'Asdfa', lastName: 'lastname' }).set('Authorization', 'Bearer someToken')
    expect(res.statusCode).toBe(400)
  })

  test('firstname 4 letters check', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'Asd', lastName: 'lastname' }).set('Authorization', 'Bearer someToken')
    expect(res.statusCode).toBe(400)
  })

  test('firstname letters and dashes check', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'Asdqwer4', lastName: 'Lastname' }).set('Authorization', 'Bearer someToken')
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe(`Validation Errors [ { param: 'firstName',
    msg: 'Invalid firstName',
    value: 'Asdqwer4' } ]`)
  })

  test('should create a user', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'Firstname', lastName: 'Lastname' }).set('Authorization', 'Bearer someToken')
    const user = await db.User.findById(res.body.id)

    expect(res.statusCode).toBe(201)
    expect(res.type).toBe('application/json')
    expect(res.body.firstName).toBe('Firstname')
    expect(res.body.lastName).toBe('Lastname')
    expect(user.firstName).toBe('Firstname')
    expect(user.lastName).toBe('Lastname')
  })

  test('should list all users', async () => {
    await db.User.create({ firstName: 'Firstname1', lastName: 'Lastname1' })
    await db.User.create({ firstName: 'Firstname2', lastName: 'Lastname2' })
    const res = await request(app).get('/api/users').set('Authorization', 'Bearer someToken')

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.length).toBe(2)
    expect(res.body[0].firstName).toBe('Firstname1')
    expect(res.body[0].lastName).toBe('Lastname1')
    expect(res.body[1].firstName).toBe('Firstname2')
    expect(res.body[1].lastName).toBe('Lastname2')
  })

  test('should modify a user', async () => {
    let user = await db.User.create({ firstName: 'Firstname1', lastName: 'Lastname1' })
    const res = await request(app).put(`/api/users/${user.id}`).send(
      {
        firstName: 'Different-firstname',
        lastName: 'Different-lastname',
      })
      .set('Authorization', 'Bearer someToken')

    user = await db.User.findById(user.id)

    expect(res.statusCode).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body.firstName).toBe('Different-firstname')
    expect(res.body.lastName).toBe('Different-lastname')
    expect(user.firstName).toBe('Different-firstname')
    expect(user.lastName).toBe('Different-lastname')
  })

  test('should delete a user', async () => {
    const user = await db.User.create({ firstName: 'Firstname', lastName: 'Lastname' })
    const res = await request(app).delete(`/api/users/${user.id}`).set('Authorization', 'Bearer someToken')
    const foundUser = await db.User.findById(user.id)

    expect(res.statusCode).toBe(204)
    expect(foundUser).toBe(null)
  })
})
