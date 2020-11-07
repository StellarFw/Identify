const shortName = user => {
  let parts = user.name.split(' ')
  if (parts.length < 2) { return parts[0]; }

  return `${parts[0]} ${parts[parts.length - 1]}`
}

exports.default = {
  name: 'auth.stripUser',
  description: 'Stripes the user object from any private information. This also adds the short name for the user.',
  inputs: {
    user: {
      description: 'User object to be stripped',
      required: true,
    }
  },

  async run (_, { params, response }) {
    const newUser = { ...params.user };

    // remove user password to protect the user data from being exposed to the public
    delete newUser.password;

    newUser.shortName = shortName(newUser);

    response.user = newUser;
  }
}
