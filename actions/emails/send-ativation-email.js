exports.default = {
  name: "identify.sendActivationEmail",
  description: "Send the activation email for the given user",
  
  private: true,

  inputs: {
    email: {
      description: "Email of the user that must be activated",
      type: "string",
      required: true,
    }
  },


  async run(api, { params }) {
    const { user } = await api.actions.call("identify.getUserByEmail", params);

    // generate an activation link and send the activation email
    const activationLink = api.config.auth.urls.activationLink(user.resetToken);

    const subject = api.config.auth.emails.activationTitle;
    const body = api.config.auth.emails.activation({ activationLink });

    api.actions.call("postman.sendMail", {
      to: user.email,
      body,
      subject,
      format: "html"
    });
  }
}
