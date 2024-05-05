const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
const loginAttempts = {};
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    if (loginAttempts[email] && loginAttempts[email].attempts >= 5) {
      const lastAttemptTime = loginAttempts[email].lastAttemptTime;
      const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;

      if (lastAttemptTime >= thirtyMinutesAgo) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts.'
        );
      } else {
        loginAttempts[email] = { attempts: 0, lastAttemptTime: null };
      }
    }
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      loginAttempts[email] = {
        attempts: (loginAttempts[email]?.attempts || 0) + 1,
        lastAttemptTime: Date.now(),
      };

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }
    loginAttempts[email] = { attempts: 0, lastAttemptTime: null };

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
