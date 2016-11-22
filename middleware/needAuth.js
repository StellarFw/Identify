const jwt = require('jsonwebtoken')

exports.needAuth = {
  name: 'auth.needAuth',
  description: 'The user needs authentication to access the action',

  preProcessor: (action, next) => {
    // get the API reference
    let api = action.api

    // check action params for token
    let token = action.params.token

    // if the token was not found on the action params and
    // the connection is HTTP check the headers
    if (token === undefined && action.connection.type === 'web') {
      token = action.connection.rawConnection.req.headers[ 'x-access-token' ]
    }

    // decode token
    if (token) {
      // verify secret and check exp
      jwt.verify(token, api.config.auth.secret, (error, decoded) => {
        if (error) { return next(new Error(api.config.auth.errors.malformedToken())) }

        // if everything is good, save was an action property to be used later
        action.authDecodedToken = decoded

        // execute the callback function
        return next()
      })

      return
    }

    return next(api.config.auth.errors.tokenNotProvided())
  }
}
