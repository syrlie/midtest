const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const invoices = require('./components/invoices/invoices-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  invoices(app);

  return app;
};
