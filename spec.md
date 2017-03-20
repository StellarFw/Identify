# Identify Stability Proposal

Identify is a module for [Stellar](https://stellar-framework.com) that allows developers to add authentication feature to their projects. This is a [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) approach on features like account creation, login, logout, confirmation by e-mail, password reset, and so on.

In order to maintain a secure connection between the server and the client, Identify uses the [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) standard. This document is a specification for this module, describing in detail all the provided features and their implementation.

## Models

### `User`

This model represents a user on the database. This model contains the following fields:

* **name**: Name of the user (`string`, `default=''`);
* **email**: User email, this will be used on the login process (`string`, `required`);
* **password**: Password, this field will be used in the login process (`string`, `required`);
* **resetToken**: This field is used to store the reset token, this token is used for the user reset their password (`string`, `defaultsTo=null`);
* **resetTokenExpire**: This field is used to store the expire time of the reset token (`datetime`, `defaultsTo=null`);
* **active**: This field indicates if the account is active or not (`boolean`, `defaultsTo=false`);
* **shortName**: This is a automatic field that is generated using the first name and the last name from the `name` field (`string`, `computed`);
* **metadata**: This field is used to store additional user information, like personal configurations, using a hash (`object`, `defaultsTo={}`).

The developer can extend the model by using the system events. In this case using the `core.models.add.user`.

## Configurations

### identify.activeByDefault

This configuration allow the developer set what the account state when the user makes signup. By default the value is set to `false`, this means that the account is inactive.

## Errors

In this section are defined all the error messages used in the module. This messages must be specified using the configuration system, in order to allow the customized by the developer. The only thing that should be constant is the error ID, the ID correspond to the key on the following list.

- `UserAlreadyExistsError`: The user email is already in user.

## Actions

### `identify.register`

#### Description

This action is responsible to create a new user.

#### Parameters

* `name (string)`: user real name;
* `email (string, required)`: this field must contain the email that the user will use to make login;
* `password (string, required, min:6)`: this must contains a clear text version of the password that the user will use to make login.

#### Process

This method must run these steps:

1. If there is already an user with the same `email`, on the database, the `UserAlreadyExistsError` must be thrown.
2. The `password` input is hashed.
3. The event `identify.beforeRegister` is executed and the input parameters is passed as parameter.
4. The `active` field is set with the `identify.activeByDefault` config.
5. Create the user on the database.
6. Execute the `identify.afterRegister` and pass the created model as parameter.
7. Return a success response with a `user` field that contains the created user model.
