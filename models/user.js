'use strict'

exports.default = (api, mongoose) => {
  // get Schema type
  const Schema = mongoose.Schema

  // create a new schema
  const userSchema = new Schema({
    email: { type : String , unique : true, required : true },
    password: { type: String, required: true},
    resetToken: String,
    resetTokenExpire: Date,
    active: Boolean
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
