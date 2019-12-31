exports.default = {
  name: "identify.getUserByEmail",
  description: "Get the user record by email",

  inputs: {
    email: {
      description: "Email for the user to be get",
      type: "string",
      required: true,
      validator: "email"
    }
  },

  async run(api, { params, response }) {
    const User = api.models.get("user");
    const record = await User.findOne({ email: params.email });

    if (!record) {
      throw api.config.auth.errors.userDoesNotExists;
    }

    response.user = record
  }
}
