const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const invoicesControllers = require('./invoices-controller');
const invoicesValidator = require('./invoices-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/invoices', route);

  route.get('/', authenticationMiddleware, invoicesControllers.getInvoices);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(invoicesValidator.createInvoice),
    invoicesControllers.createInvoice
  );

  route.get('/:id', authenticationMiddleware, invoicesControllers.getInvoice);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(invoicesValidator.updateInvoice),
    invoicesControllers.updateInvoice
  );

  route.delete(
    '/:id',
    authenticationMiddleware,
    invoicesControllers.deleteInvoice
  );
};
