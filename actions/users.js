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
    UserModel.findById(userParams._id)
      .catch(error => { next(error) })
      .then(user => {
        // if the user not exists throw an error
        if (!user) { return next(new Error(`The user not exists!`)) }

        // if there is an password on the action input params that password must
        // be hashed before the save
        if (userParams.password && userParams.password !== user.password) {
            // TODO: this must be placed on the model and we need to check if
            // the confirmation field exists
            userParams.password = api.hash.hashSync(action.params.password)
        }

        // update the user information
        UserModel.findOneAndUpdate({ _id: userParams._id }, userParams, (error, model) => {
          // pass the updated user model to the action response
          action.response.user = model

          // finish the action execution
          next()
        })
      })
  }
}]
