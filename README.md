# Identify

Identify is an authentication solution for Stellar made to cur repetitive work involving management of users. A [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) approach on features like account creation, login, logout, confirmation by e-mail, password reset, etc.

## Composition

- actions:
 - **`auth.register`** - create a new user account;
 - **`auth.login`** - login with an existent user account;
 - **`auth.disableUser`** - disable the user account. Disabled users can not make login;
- models:
 - **`user`** - model to represent a user on the database;
- middleware:
 - **`auth.needAuth`** - only authenticated users can access the protected action.

## Quick start

To start using Identify on your Stellar application you can follow the commands below.

If you use git to manage the changes in your application you can add Identify as a Git submodule.

```shell
# add Identify as a Git submodule
git submodule add https://github.com/StellarFw/Identify modules/identify
```

If you don't use Git in your app you can use Git only to clone the repo or make the download of repository Zip.

```shell
git clone https://github.com/StellarFw/Identify modules/identify
```

### Activate the Module

Now to activate the module you just need add `"identify"` to the `manifest.json` file on your app root folder. Like this:

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",

  "modules": [ "identify" ]
}
```

## Usage

The code below show the usage of the middleware:

```javascript
exports.example = {
  name: 'example',
  description: 'This is a protected action',

  middleware: ['auth.needAuth'],

  run: (api, action, next) => {
    // only authenticated users reach this point
    // do something...

    next()
  }
}
```

> Note: it's recommended load this module before all the others.

## TODOs

- Add a mechanism to reset the user password
- Add a way to validate users at account creation
- Add a way to invalidate tokens
- Add an action to check the session status (the token may be expired)
