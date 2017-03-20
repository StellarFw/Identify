# Identify Stability Proposal

Identify is a module for [Stellar](https://stellar-framework.com) that allow developers add authentication feature to their projects. This is a [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) approach on features like account creation, login, logout, confirmation by e-mail, password reset, and so on.

This document is a specification for this module, describing in detail all the provided features and their implementation.

## Models

### `User`

This model represents a user on the database. This model contains the following fields:

* **`name`**: Name of the user (`string`, `default=''`);
* **`email`**: User email, this will be used on the login process (`string`, `required`);
* **`password`**: Password, this field will be used in the login process (`string`, `required`);
* **`resetToken`**: This field is used to store the reset token, this token is used for the user reset their password (`string`, `defaultsTo=null`);
* **`resetTokenExpire`**: This field is used to store the expire time of the reset token (`datetime`, `defaultsTo=null`);
* **`active`**: This field indicates if the account is active or not (`boolean`, `defaultsTo=false`);
* **`shortName`**: This is a automatic field that is generated using the first name and the last name from the `name` field (`string`, `computed`);
