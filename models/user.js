'use strict'

exports.default = {
  email: { type : String , unique : true, required : true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpire: Date
}
