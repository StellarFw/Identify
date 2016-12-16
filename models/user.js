'use strict'

exports.default = api => {
  // create a model for the user
  const userSchema = {
    attributes: {
      name: { type: 'string', default: '' },
      email: { type : 'string' , unique : true, defaultsTo : true },
      password: { type: 'string', defaultsTo: true},
      resetToken: 'string',
      resetTokenExpire: 'datetime',
      active: 'boolean',

      /**
       * Build the user's short name.
       *
       * If the name fields only contains one word return them, otherwise return the
       * first and the last work.
       */
      shortName () {
        let parts = this.name.split(' ')
        if (parts.length < 2) { return parts.shift() }

        return `${parts.shift()} ${parts.pop()}`
      },

      /**
       * Define a custom `toJSON` method to remove the password from the output
       */
      toJSON () {
        const user = this.toObject()

        // remove the password field
        delete user.password

        // append the shortName
        user.shortName = this.shortName()

        return user
      }
    }
  }

  // return the model
  return userSchema
}
