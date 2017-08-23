const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    googleIOSClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  },
  test: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    googleIOSClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  },
  production: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    googleIOSClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  },
}

export default { env, fields: config[env] }
