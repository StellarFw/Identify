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
    },
    active: {
      type: "boolean",
      default: api => api.config.auth.activeByDefault,
      description: "Account activation state after creation"
    }
  },

  run (api, action, next) {
    const userData = JSON.parse(JSON.stringify(action.params))
    userData.password = api.hash.hashSync(action.params.password)

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
