'use strict'

exports.default = {
  auth: api => {
    return {
      // ---------------------------------------------------------------------
      // Secret token to generate the JWT token
      // ---
      // This must be changed on the application configs.
      // ---------------------------------------------------------------------
      secret: 'thisMustBeChangedOnAppConfig',

      // ---------------------------------------------------------------------
      // Time until the token expires
      // ---
      // Expressed in seconds or a string describing a time span rauchg/ms
      // ---------------------------------------------------------------------
      expiresIn: '1 day',

      errors: {
        // don't expand this
        '_toExpand': false,

        // ---------------------------------------------------------------------
        // Token not provided
        // ---------------------------------------------------------------------
        tokenNotProvided: () => 'Token not provided',

        // ---------------------------------------------------------------------
        // Malformed token
        // ---------------------------------------------------------------------
        malformedToken: () => 'The token is invalid',

        // ---------------------------------------------------------------------
        // Expired token
        // ---------------------------------------------------------------------
        expiredToken: () => 'The token was expired',

        // ---------------------------------------------------------------------
        // Wrong username or password
        // ---------------------------------------------------------------------
        invalidCredentials: () => 'Invalid credentials',

        // ---------------------------------------------------------------------
        // User are disable
        // ---------------------------------------------------------------------
        userIsDisabled: () => 'The user are disable'
      }
    }
  }
}
