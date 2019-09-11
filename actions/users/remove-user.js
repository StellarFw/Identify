exports.default = {
  name: "auth.removeUser",
  description: "Remove the given user",

  inputs: {
    id: {
      required: true,
      type: "number",
      description: "Id of the user to be removed"
    }
  },

  async run(api, { params }) {
    const User = api.models.get("user");

    const id = params.id;

    await api.events.fire("auth.beforeRemove", { id });
    await User.destroy(id);
  }
};
