'use strict'

exports.default = (api, mongoose) => {
  // get Schema type
  const Schema = mongoose.Schema

  // create a new schema
  const userSchema = new Schema({
    name: { type: String, default: '' },
    email: { type : String , unique : true, required : true },
    password: { type: String, required: true},
    resetToken: String,
    resetTokenExpire: Date,
    active: Boolean
  }, {
    toObject: {
      virtuals: true
    }
  })

  /**
   * Build the user's short name.
   *
   * If the name fields only contains one word return them, otherwise return the
   * first and the last work.
   */
  userSchema.virtual('shortName').get(function () {
    let parts = this.name.split(' ')
    if (parts.length < 2) { return parts.shift() }

    return `${parts.shift()} ${parts.pop()}`
  })

  // define a custom `toJSON` method to remove the password from the output
  userSchema.method('toJSON', function () {
    const user = this.toObject()
    delete user.password
    return user
  })

  // return the new schema
  return userSchema
}
