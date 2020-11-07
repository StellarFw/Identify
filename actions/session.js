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
        return next(api.config.auth.errors.expiredToken())
      }

      // is an invalid token
      return next(api.config.auth.errors.malformedToken())
    }

    // append the expire timestamp
    action.response.expiresAt = decoded.exp

    // append the user info
    api.models.get('user')
      .findOne(decoded.id)
      .catch(error => { next(error) })
      .then(user => {
        // TODO: validate if the user is active

        const { user: userToOutput } = await api.actions.call('auth.stripUser', { user });
        action.response.user = userToOutput

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
