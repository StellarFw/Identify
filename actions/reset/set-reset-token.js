const addMinutes = require('date-fns/addMinutes');

exports.default = {
  name: "identify.setResetToken",
  description: "Set a reset token for the given user",
  private: true,

  inputs: {
    email: {
      description: "User which the reset token must be set",
      type: "string",
      required: true,
      validator: "email"
    }
  },

  async run(api, { params }) {
    // generate a new reset token
    const resetTokenSize = api.config.auth.resetToken.size;
    const resetToken = api.utils.randomStr(resetTokenSize);

    // compute the token expiration date
    const tokenValidity = api.config.auth.resetToken.validity;
    const resetTokenExpire = addMinutes(new Date(), tokenValidity);

    // find the user database record and set the tone
    const { user } = await api.actions.call("identify.getUserByEmail", params);
    return api.actions.call("auth.updateUser", {
      user: {
        id: user.id,
        resetToken,
        resetTokenExpire,
      },
    });
  },
}
