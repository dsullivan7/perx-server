import express from 'express'
// import bearerToken from 'express-bearer-token'

// import { verifyToken, getUser } from '../utils/routeUtils'

import usersController from '../controllers/users'

const apiRoutes = express.Router()

// apiRoutes.use(bearerToken())

// // route middleware to verify a token
// apiRoutes.use(verifyToken)

// // route middleware to get the logged in user
// apiRoutes.use(getUser)

apiRoutes.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the Bank Account API!',
}))

/**
 * @api {post} /api/users Create User
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiName CreateUser
 *
 * @apiParam (Body Parameters) {String} [firstName]  Optional first name of the User
 * @apiParam (Body Parameters) {String} [lastName]  Optional last name of the User
 *
 * @apiSuccess (Response Fields) {String} firstName First name of the User
 * @apiSuccess (Response Fields) {String} lastName  Last name of the User
 * @apiSuccess (Response Fields) {Number} id  Id of the User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "firstName": "Michael",
 *       "lastName": "Jordan",
 *       "id": 1
 *     }
 *
 */
apiRoutes.post('/users', usersController.create)

/**
 * @api {get} /api/users List Users
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiName ListUsers
 *
 * @apiSuccess (Response Fields) {String} firstName First name of the User
 * @apiSuccess (Response Fields) {String} lastName  Last name of the User
 * @apiSuccess (Response Fields) {Number} id  Id of the User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "firstName": "Michael",
 *         "lastName": "Jordan",
 *         "id": 1
 *       },
 *       {
 *         "firstName": "Kobe",
 *         "lastName": "Bryant",
 *         "id": 2
 *       },
 *     ]
 *
 */
apiRoutes.get('/users', usersController.list)

/**
 * @api {get} /api/users/:id Get User
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiName GetUser
 *
 * @apiParam (Path Parameters) {Number} id User's unique ID
 *
 * @apiSuccess (Response Fields) {String} firstName First name of the User
 * @apiSuccess (Response Fields) {String} lastName  Last name of the User
 * @apiSuccess (Response Fields) {Number} id  Id of the User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstName": "Michael",
 *       "lastName": "Jordan",
 *       "id": 1
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User Not Found"
 *     }
 */
apiRoutes.get('/users/:id', usersController.retrieve)

/**
 * @api {put} /api/users/:id Modify User
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiName ModifyUser
 *
 * @apiParam (Path Parameters) {Number} id User's unique ID
 *
 * @apiParam (Body Parameters) {String} [firstName]  Optional First name of the User
 * @apiParam (Body Parameters) {String} [lastName]   Optional Last name of the User
 *
 * @apiSuccess (Response Fields) {String} firstName First name of the User
 * @apiSuccess (Response Fields) {String} lastName  Last name of the User
 * @apiSuccess (Response Fields) {Number} id  Id of the User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstName": "Michael",
 *       "lastName": "Jordan",
 *       "id": 1
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User Not Found"
 *     }
 */
apiRoutes.put('/users/:id', usersController.update)

/**
 * @api {delete} /api/users/:id Delete User
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiName DeleteUser
 *
 * @apiParam (Path Parameters) {Number} id Users unique ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 No Content
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User Not Found"
 *     }
 */
apiRoutes.delete('/users/:id', usersController.destroy)

export default apiRoutes
