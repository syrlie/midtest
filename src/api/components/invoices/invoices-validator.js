const joi = require('joi');
const { bill_to } = require('../../../models/invoices-schema');

module.exports = {
  createInvoice: {
    body: {
      bill_to: joi.string().min(1).max(100).required().label('Bill To'),
      total: joi.number().required().label('Total'),
      paid: joi.string().valid('yes', 'no').required().label('Paid'),
    },
  },

  updateInvoice: {
    body: {
      bill_to: joi.string().min(1).max(100).required().label('Bill To'),
      total: joi.number().required().label('Total'),
      paid: joi.string().valid('yes', 'no').required().label('Paid'),
    },
  },
};
