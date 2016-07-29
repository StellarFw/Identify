# st-auth

st-auth is an authentication module for Stellar.

## Composition

* actions
 * `auth.signup` - create a new user account
 * `auth.signin` - login with an existent user account
* middleware
 * `auth.needAuth` - only authenticated users can access the protected action

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

> Note: It's recommended load this module before all the others.
