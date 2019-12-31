const R = require("ramda");

exports.default = {
  name: "identify.activateUser",
  description: "Activate the given user if token is correct",

  inputs: {
    token: {
      description: "User activation token",
      type: "string",
      required: true,
    },
  },

  async run(api, { params }) {
    const User = api.models.get("user");

    // get user by token, if it doesn't exists return an error
    const user = await User.findOne({ resetToken: params.token })
    if (R.isNil(user)) {
      throw api.config.auth.errors.malformedToken()
    }

    // check if the token expiration date is valid, otherwise return an error
    const expirationDate = user.resetTokenExpire;
    const today = new Date();
    if (R.gte(today, expirationDate)) {
      throw api.config.auth.errors.expiredToken()
    }

    // mark user as active and remove the expiration token
    const dataToUpdate = {
      resetToken: null,
      resetTokenExpire: null,
      active: true,
    };

    return api.actions.call("auth.updateUser", {
      user: {
        id: user.id,
        ... dataToUpdate
      }
    })
  }
}
