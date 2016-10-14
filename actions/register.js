'use strict'

module.exports = [{
  name: 'auth.register',
  description: 'Create a new user from a email and password',

  protected: true,

  inputs: {
    name: {
      validator: 'alpha_space',
      description: `User's real time`
    },
    email: {
      required: true,
      validator: 'email',
      description: 'Email for the new user account'
    },
    password: {
      required: true,
      validator: 'confirmed|min:6|max:20',
      description: 'Password for the new user account'
    }
  },

  run (api, action, next) {
    // generate the password hash
    let hash = api.hash.hashSync(action.params.password)

    // user data
    // todo: for now all users are active by default, but we need implement a
    // way to validate the register before activate the user account
    let userData = { email: action.params.email, password: hash, active: true }

    // event: before creation
    api.events.fire('auth.beforeCreation', userData)
      .then(userData => {
        // create a new user model instance
        let newModel = new(api.models.get('user'))(userData)

        // save the new model and return the promise
        return newModel.save()
      })
      .then(model => {
        // event: after creation
        api.events.fire('auth.afterCreation', model)

        // append the new model on the response object
        action.response.success = true
        action.response.user = model

        // finish the action execution
        next()
      })
      .catch(error => next(new Error('We can create that resource!')))
  }
}]
