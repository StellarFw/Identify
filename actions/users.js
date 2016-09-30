module.exports = [{
  name: 'auth.getUsers',
  description: 'Get all registered users',

  run (api, action, next) {
    // get the User model
    const User = api.models.get('user')

    // get all users and return them to the client
    User.find({})
      .then(users => {
        action.response.users = users

        next()
      })
      .catch(err => { next(new Error(err)) })
  }
}, {
  name: 'auth.disableUser',
  description: `This disable an user account. The user will not be able to
    perform login or reset the password.`,

    inputs: {
      id: {
        required: true,
        description: 'User identifier.'
      }
    },

    run (api, action, next) {
      // try find the user and disable his account
      api.models.get('user').findById(action.params.id)
        .then(user => {
          // check if the user exists
          if (!user) { return next(new Error(`The user not exists!`)) }

          // disable the user
          user.active = false

          // save the model and return a success message
          user.save()
          action.response.success = 'The user was been disabled!'

          next()
        })
    }
}, {
  name: 'auth.activateUser',
  description: `This activate a disabled user account.`,

  inputs: {
    id: {
      required: true,
      description: 'user identifier.'
    }
  },

  run (api, action, next) {
    // try find the user and activate his account
    api.models.get('user').findById(action.params.id)
      .then(user => {
        // check if the user exists
        if (!user) { return next(new Error(`The user not exists!`)) }

        // activate the user
        user.active = true

        // save the model and return a success message
        user.save()
        action.response.success = 'The user was now active!'

        next()
      })
  }
}]
