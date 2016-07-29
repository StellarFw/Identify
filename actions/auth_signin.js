'use strict'

let jwt = require('jsonwebtoken')

module.exports = [ {
  name: 'auth.signin',
  description: 'This action was generated using the command line tool',

  // this action can't be override
  protected: true,

  // input restrictions
  inputs: {
    username: {
      required: true,
      validator: 'min:3|max:20',
      description: 'Username field'
    },
    password: {
      required: true,
      validator: 'min:6|max:20',
      description: 'Password field'
    }
  },

  run: (api, action, next) => {
    // check if the user exists
    api.models.get('user').findOne({
      username: action.params.username
    }, (error, user) => {
      // if an error occurs finish the action execution
      if (error) { return next(error) }

      // check if the user was found
      if (!user) { return next(api.config.auth.errors.invalidCredentials()) }

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

      // finish the action execution
      next()
    })
  }
} ]
