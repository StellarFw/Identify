'use strict'

module.exports = [ {
  name: 'auth.signup',
  description: 'Create a new user from a username and password',

  inputs: {
    username: {
      required: true,
      validator: 'min:3|max:20',
    },
    password: {
      required: true,
      validator: 'confirmed|min:6|max:20'
    }
  },

  run: (api, action, next) => {
    // generate the password hash
    let hash = api.hash.hashSync(action.params.password)

    // user data
    let data = { username: action.params.username, password: hash }

    // create a new user model instance
    let newModel = new (api.models.get('user'))(data)

    // save it
    newModel.save(err => {
      // return an error message to the client if occurs an error
      if (err) { return next(new Error('We can create that resource!')) }

      // append the new model on the response object
      action.response.success = true
      action.response.user = newModel

      // finish the action execution
      next()
    })
  }
} ]
