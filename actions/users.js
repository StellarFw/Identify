module.exports = [
  {
    name: "auth.disableUser",
    description: `This disable an user account. The user will not be able to
    perform login or reset the password.`,

    inputs: {
      id: {
        required: true,
        description: "User identifier."
      }
    },

    run(api, action, next) {
      // try find the user and disable his account
      api.models
        .get("user")
        .findOne(action.params.id)
        .then(user => {
          // check if the user exists
          if (!user) {
            return next(new Error(`The user not exists!`));
          }

          // disable the user
          user.active = false;

          // update the user
          return api.actions.call("auth.updateUser", { user });
        })
        .then(_ => {
          action.response.success = "The user was been disabled!";
          next();
        });
    }
  },
  {
    name: "auth.activateUser",
    description: `This activate a disabled user account.`,

    inputs: {
      id: {
        required: true,
        description: "user identifier."
      }
    },

    async run(api, action) {
      const user = await api.models.get("user").findOne(action.params.id);

      if (!user) {
        throw api.config.auth.errors.userDoesNotExists;
      }

      // activate the user and update the user record
      user.active = true;
      await api.actions.call("auth.updateUser", { user });

      action.response.success = "The user is now active!";
    }
  },
  {
    name: "auth.updateUser",
    description: `This updates the user information`,

    inputs: {
      user: {
        required: true,
        description: `User information`
      }
    },

    run(api, action) {
      // get the user model
      const UserModel = api.models.get("user");

      // get user params
      let userParams = action.params.user;

      // get the user to be edited
      // TODO: improve the follow code, some operations can be optimized and more
      // automatic
      return UserModel.findOne(userParams.id)
        .then(user => {
          // if the user not exists throw an error
          if (!user) {
            throw new Error(`The user not exists!`);
          }

          // if there is an password on the action input params that password must
          // be hashed before the save
          if (userParams.password && userParams.password !== user.password) {
            // TODO: this must be placed on the model and we need to check if
            // the confirmation field exists
            userParams.password = api.hash.hashSync(userParams.password);
          }

          // update the user information
          return UserModel.update(userParams.id, userParams);
        })
        .then(([user]) => {
          // pass the updated user model to the action response
          action.response.user = user;
        });
    }
  }
];
