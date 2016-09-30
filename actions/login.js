let jwt = require('jsonwebtoken')

module.exports = [{
  name: 'auth.login',
  description: 'This action was generated using the command line tool',

  // this action can't be override
  protected: true,

  // input restrictions
  inputs: {
    email: {
      required: true,
      validator: 'email'
    },
    password: {
      required: true,
      validator: 'min:6|max:20'
    }
  },

  run: (api, action, next) => {
    // check if the user exists
    api.models.get('user').findOne({ email: action.params.email })
      .then(user => {
        // check if the user was found
        if (!user) { return next(api.config.auth.errors.invalidCredentials()) }

        // the user must be active
        if (!user.active) { return next(api.config.auth.errors.userIsDisabled()) }

        // check if password matches
        if (!api.hash.compareSync(action.params.password, user.password)) {
          return next(api.config.auth.errors.invalidCredentials())
        }

        // if user is found and password is right, create a new token
        let token = jwt.sign(user, api.config.auth.secret, { expiresIn: api.config.auth.expiresIn })

        // return the token
        action.response.token = token

        // return the user data, but first remove the password field
        let userToOutput = user.toJSON()
        delete userToOutput.password
        action.response.user = userToOutput

        // event: login response
        api.events.fire('auth.loginResponse', action.response)
          .then(response => next())
          .catch(error => next(error))
      })
      .catch(error => next(error))
  }
}]
