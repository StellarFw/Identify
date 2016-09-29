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
}]
