exports.default = {
  name: 'auth.getUsers',
  description: 'Get all registered users',

  inputs: {
    active: {
      description: "When set will be used to filter the users by state",
      type: "boolean",
      format: val => typeof val === "boolean" ? val : true,
    }
  },

  async run (api, action) {
    // get the User model
    const User = api.models.get('user')

    const query = {}

    if (action.params.active !== null) {
      query.active = action.params.active;
    }

    // build the query to get all registered users
    let search = User.find(query);

    // perform a event on the search object in order to allow other modules
    // extend it
    search = (await api.events.fire('identify.beforeSearchUsers', { search })).search

    let users = await search;
    
    // perform a event after the search
    users = (await api.events.fire('identify.afterSearchUsers', { users })).users

    // put the users available on the response
    action.response.users = users
  }
}
