module.exports = [{
  name: 'auth.getUsers',
  description: 'Get all registered users',

  run (api, action) {
    // get the User model
    const User = api.models.get('user')

    // build the query to get all registered users
    const search = User.find({})

    // perform a event on the search object in order to allow other modules
    // extend it
    return api.events.fire('identify.beforeSearchUsers', { search })
    .then(({ search }) => search)

    // perform a event after the search
    .then(users => api.events.fire('identify.afterSearchUsers', { users }))

    // put the users available on the response
    .then(({ users }) => { action.response.users = users })
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
      api.models.get('user')
        .findOne(action.params.id)
        .then(user => {
          // check if the user exists
          if (!user) { return next(new Error(`The user not exists!`)) }

          // disable the user
          user.active = false

          // update the user
          return api.actions.call('auth.updateUser', { user })
        })
        .then(_ => {
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
    api.models.get('user')
      .findOne(action.params.id)
      .then(user => {
        // check if the user exists
        if (!user) { return next(new Error(`The user not exists!`)) }

        // activate the user
        user.active = true

        // update the user
        return api.actions.call('auth.updateUser', { user })
      })
      .then(_ => {
        action.response.success = 'The user was now active!'
        next()
      })
  }
}, {
  name: 'auth.updateUser',
  description: `This updates the user information`,

  inputs: {
    user: {
      required: true,
      description: `User information`
    }
  },

  run (api, action, next) {
    // get the user model
    const UserModel = api.models.get('user')

    // get user params
    let userParams = action.params.user

    // get the user to be edited
    // TODO: improve the follow code, some operations can be optimized and more
    // automatic
    UserModel.findOne(userParams.id)
      .then(user => {
        // if the user not exists throw an error
        if (!user) { throw new Error(`The user not exists!`) }

        // if there is an password on the action input params that password must
        // be hashed before the save
        if (userParams.password && userParams.password !== user.password) {
            // TODO: this must be placed on the model and we need to check if
            // the confirmation field exists
            userParams.password = api.hash.hashSync(action.params.password)
        }

        // update the user information
        return UserModel.update({ id: userParams.id }, userParams)
      })
      .then(model => {
        // pass the updated user model to the action response
        action.response.user = model

        // finish the action execution
        next()
      })
      .catch(error => { next(error) })
  }
}]
