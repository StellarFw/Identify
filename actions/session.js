const jwt = require('jsonwebtoken')

module.exports = [{
  name: 'auth.checkSession',
  description: `This action validates the session token and return the user
    information`,

  inputs: {
    token: {
      description: 'Session token to be validated',
      required: true
    }
  },

  run (api, action, next) {
    let decoded = null

    // decode the given token. If the token is invalid the action must return an
    // error or if the token was expired.
    try {
      decoded = jwt.verify(action.params.token, api.config.auth.secret)
    } catch (error) {
      // token was expired
      if (error.name === 'TokenExpiredError') {
        return next(new Error(api.config.auth.errors.expiredToken()))
      }

      // is an invalid token
      return next(new Error(api.config.auth.errors.malformedToken()))
    }

    // append the expire timestamp
    action.response.expiresAt = decoded.exp

    // append the user info
    api.models.get('user').findById(decoded._doc._id)
      .catch(error => { next(error) })
      .then(user => {
        // TODO: validate if the user is active

        // append the user object to the response
        action.response.user = user

        // fire an event to allow other modules append new information to the
        // response
        return api.events.fire('auth.checkSessionResponse', action.response)
      })
      .catch(error => { next(error) })
      .then(_ => {
        // finish the action execution
        next()
      })
  }
}]
