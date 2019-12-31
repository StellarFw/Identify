'use strict'

exports.default = {
  event: "auth.afterCreation",
  description: "Send activation email if that feature is on",

  async run({actions, config}, params, next) {
    // if the user account is active by default there is no need to send an 
    // activation email
    if (config.auth.activeByDefault) {
      return
    }

    const email = params.email;

    // set reset token for the user
    await actions.call("identify.setResetToken", {
      email
    });

    // send the activation email
    await actions.call("identify.sendActivationEmail", {
      email
    })

    next()
  }
}
