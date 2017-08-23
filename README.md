# Perx Server

[![Build Status](https://travis-ci.org/dsullivan7/perx-server.svg?branch=master)](https://travis-ci.org/dsullivan7/perx-server)
[![Coverage Status](https://img.shields.io/coveralls/dsullivan7/perx-server.svg)](https://coveralls.io/r/dsullivan7/perx-server?branch=master)

## Start
```bash
# ensure the environment variable $DATABASE_NAME is set to what you would like the database to be named
# ensure the environment variable $DATABASE_URL is set to your postgres url
npm install
npm run create-db
npm start
```

## Development
```bash
npm install
eval $(cat .env) npm run create-db
eval $(cat .env) npm run migrate
eval $(cat .env) npm run start-dev
```

## Tests
```bash
eval $(cat .test-env) npm test
```
