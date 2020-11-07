'use strict'

exports.default = api => {
  // create a model for the user
  const userSchema = {
    attributes: {
      name: { type: 'string', defaultsTo: '' },
      email: {
        type : 'string' ,
        required : true,
        autoMigrations: {
          unique : true,
        }
      },
      password: { type: 'string', required: true},
      resetToken: { type: 'string' },
      // TODO: add date validator
      resetTokenExpire: {
        type: 'string'
      },
      active: { type: 'boolean' },
    }
  }

  // return the model
  return userSchema
}
