'use strict'

module.exports = [{
  name: 'auth.register',
  description: 'Create a new user from a email and password',

  protected: true,

  inputs: {
    name: {
      description: `User's real time`
    },
    email: {
      required: true,
      validator: 'email',
      description: 'Email for the new user account'
    },
    password: {
      required: true,
      validator: 'min:6|max:20',
      description: 'Password for the new user account'
    }
  },

  run (api, action, next) {
    // generate the password hash
    let hash = api.hash.hashSync(action.params.password)

    // clone the action params
    const userData = JSON.parse(JSON.stringify(action.params))

    // user data
    // todo: for now all users are active by default, but we need implement a
    // way to validate the register before activate the user account
    userData.password = hash
    userData.active = true

    // event: before creation
    api.events.fire('auth.beforeCreation', userData)
      .then(userData => api.models.get('user').create(userData))
      .then(model => {
        // event: after creation
        api.events.fire('auth.afterCreation', model)

        // append the new model on the response object
        action.response.success = true
        action.response.user = model

        // finish the action execution
        next()
      })
      .catch(error => next(error))
  }
}]
