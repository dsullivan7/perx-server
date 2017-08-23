import GoogleAuth from 'google-auth-library'
import config from '../config/config'

const googleClientId = config.fields.googleClientId
const googleAndroidClientId = config.fields.googleAndroidClientId
const googleIOSClientId = config.fields.googleIOSClientId
const auth = new GoogleAuth()
const client = new auth.OAuth2([googleClientId, googleAndroidClientId, googleIOSClientId], '', '')

const verifyToken = token => new Promise((resolve, reject) => {
  client.verifyIdToken(
    token,
    [googleClientId, googleAndroidClientId, googleIOSClientId],
    (err, login) => {
      if (login) {
        const payload = login.getPayload()
        resolve(payload)
      } else {
        reject(err)
      }
    },
  )
})

module.exports = { verifyToken }
