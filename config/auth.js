const getBaseUrl = api => api.config.auth.urls.baseUrl;
const getEmailTitle = api => api.config.auth.emails.title;

exports.default = {
  auth: api => {
    return {
      // ---------------------------------------------------------------------
      // Secret token to generate the JWT token
      // ---
      // This must be changed on the application configs.
      // ---------------------------------------------------------------------
      secret: "thisMustBeChangedOnAppConfig",

      // ---------------------------------------------------------------------
      // Time until the token expires
      // ---
      // Expressed in seconds or a string describing a time span rauchg/ms
      // ---------------------------------------------------------------------
      expiresIn: "1 day",

      // ---------------------------------------------------------------------
      // Default account state
      // ---
      // Set the default account activation state after user registration
      // ---------------------------------------------------------------------
      activeByDefault: true,

      urls: {
        _toExpand: false,

        // ---------------------------------------------------------------------
        // Base URL
        // ---
        // URL that will be used for all the links: activation, reset...
        // ---------------------------------------------------------------------
        baseUrl: "https://example.com",

        // ---------------------------------------------------------------------
        // Activation link
        // ---
        // Activation link that is used on the activation email that is sent to
        // the user when a new account is created.
        // ---------------------------------------------------------------------
        activationLink: token => `${getBaseUrl(api)}/activation/${token}`
      },

      resetToken: {
        // ---------------------------------------------------------------------
        // Time until the reset token becomes invalid
        // ---
        // Expressed in minutes. By default is set to 15 days.
        // ---------------------------------------------------------------------
        validity: 21600,

        // ---------------------------------------------------------------------
        // Size for the reset token.
        // ---------------------------------------------------------------------
        size: 32,
      },

      emails: {
        _toExpand: false,

        // ---------------------------------------------------------------------
        // Title to be used on all the sent emails
        // ---------------------------------------------------------------------
        title: "Identify",


        // ---------------------------------------------------------------------
        // Title for the activation email
        // ---------------------------------------------------------------------
        activationTitle: "Activation Email",

        // ---------------------------------------------------------------------
        // Text of the email to be sent when the user creates a new account.
        // ---
        // This function receives an object with the following props:
        // - activationLink: link with the URL for the activation
        // ---------------------------------------------------------------------
        activation: opts => `
          <h1>${getEmailTitle(api)}</h1>
          Click on the following link to activate your account <a href="${opts.activationLink}">${opts.activationLink}</a>.
        `,
      },

      errors: {
        // don't expand this
        _toExpand: false,

        // ---------------------------------------------------------------------
        // Token not provided
        // ---------------------------------------------------------------------
        tokenNotProvided: () => {
          return {
            code: "token_not_provided",
            message: "Token not provided"
          };
        },

        // ---------------------------------------------------------------------
        // Malformed token
        // ---------------------------------------------------------------------
        malformedToken: () => {
          return {
            code: "malformed_token",
            message: "The token is invalid"
          };
        },

        // ---------------------------------------------------------------------
        // Expired token
        // ---------------------------------------------------------------------
        expiredToken: () => {
          return {
            code: "expired_token",
            message: "The token was expired"
          };
        },

        // ---------------------------------------------------------------------
        // Wrong username or password
        // ---------------------------------------------------------------------
        invalidCredentials: () => {
          return {
            code: "invalid_credentials",
            message: "Invalid credentials"
          };
        },

        // ---------------------------------------------------------------------
        // User are disable
        // ---------------------------------------------------------------------
        userIsDisabled: () => {
          return {
            code: "user_id_disabled",
            message: "The user are disable"
          };
        },

        // ---------------------------------------------------------------------
        // Means the user doesn't exists on the database
        // ---------------------------------------------------------------------
        userDoesNotExists: {
          code: "user_does_not_exists",
          message: "The user doesn't exists"
        }
      }
    };
  }
};
