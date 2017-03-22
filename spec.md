# Identify Stability Proposal

Identify is a module for [Stellar](https://stellar-framework.com) that allows developers to add authentication feature to their projects. This is a [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) approach on features like account creation, login, logout, confirmation by e-mail, password reset, and so on.

In order to maintain a secure connection between the server and the client, Identify uses the [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) standard. This document is a specification for this module, describing in detail all the provided features and their implementation.

## Models

### `User`

Represents a user on the database, it contains the following fields:

* **name**: User name (`string`, `default=''`);
* **email**: User email, will be used on the login process (`string`, `required`);
* **password**:User acess password, used in the login process (`string`, `required`);
* **resetToken**: Used to store the reset token when the user reset her password (`string`, `defaultsTo=null`);
* **resetTokenExpire**: Used to store the expire time of the reset token (`datetime`, `defaultsTo=null`);
* **active**: Indicates if the account is active or not (`boolean`, `defaultsTo=false`);
* **shortName**:Automatic field that is generated using the first name and the last name from the `name` field (`string`, `computed`);
* **metadata**:Used to store additional user information like personal configurations, using a hash (`object`, `defaultsTo={}`).

The developer can extend the model by using the system events. In this case using the `core.models.add.user`.

## Configurations

### identify.activeByDefault

This configuration allows the developer to set if the user account is active or not by default. By default the value is set to `false`.

### identify.activationTokenDuration

This configuration contains how long the token is valid. Accepts values in milliseconds. By default is set to `1440000` (1 day).

### identify.activationLink

This configuration is mandatory in order to send reset and activation links to the user by email. By default, this is set to `null`.

## Errors

In this section are defined all the error messages used in the module. This messages must be specified using the configuration system, in order to allow to be customized by the developer. The only thing that should be constant is the error ID. The ID correspond to the key on the following list.

- `UserAlreadyExistsError`: The user email is already in user.
- `InvalidCredentialsError`: Invalid credentials.
- `InactiveAccountError`: The account is inactive. Please, check your email for the activation link or request a new activation link.

## Actions

### `identify.register`

#### Description

This action is responsible to create a new user.

#### Parameters

- `name (string)`: user real name.
- `email (string, required)`: must contain the user login email.
- `password (string, required, min:6)`:must contain a clear text version of the user login password.`

#### Process

This action must run these steps:

1. If there is already an user with the same `email`, on the database, the `UserAlreadyExistsError` must be thrown.
2. The `password` input is hashed.
3. The event `identify.beforeRegister` is executed and the input parameters is passed as parameter.
4. The `active` field is set with the `identify.activeByDefault` config.
5. If the `active` flag is `false`
    1. Generate an activation token with expire time based on the `identify.activationTokenDuration` config.
    2. Set the `resetToken` and the `resetTokenExpire` on user data.
    3. Send an email with the action link to the given `email`. The link must be the URL defined on the `identify.activationLink` with the query strings **token** set with the `activationToken`, and one **step** set with the value `activation`.
6. Create the user on the database.
7. Execute the `identify.afterRegister` and pass the created model as parameter.
8. Return a success response with a `user` field that contains the created user model.

### `identify.login`

#### Description

Get's a valid token that will be used by the user to identify themselves.

#### Parameters

- `email (required)`: user email.
- `password (required, min:6)`: clear text password for the given email.

#### Process

This action must run these steps:

1. If there is no registered user with the given `email`, the `InvalidCredentialsError` must be thrown.
2. If the `active` field is set to `false`, thrown the `InactiveAccountError`.
3. If the hashed password (input field) doesn't match with the `password` field of the found user, throw the `InvalidCredentialsError`.
4. Generate a new valid JSON Web Token.
5. Remove the `password` field from the output data.
6. Execute the event `identify.afterLogin` with the authenticated user and the created token.
7. Return a success message with the logged user and the valid token.

### `identify.disableUser`

Disable an user account.

#### Parameters

- `id (required, string)`: user identifier.

#### Process

This action must run these steps:

1. If there is no registered user with the given `id`, the `InvalidCredentialsError` must be thrown.
2. Set the `active` field to `false` and save the change on the database.
3. Return a success message with the user as a response field.
