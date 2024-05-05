const invoicesService = require('./invoices-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getInvoices(request, response, next) {
  try {
    const { page_number = 1, page_size = 10, sort, search } = request.query;
    const result = await invoicesService.getInvoices({
      page_number: parseInt(page_number),
      page_size: parseInt(page_size),
      sort,
      search,
    });

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getInvoice(request, response, next) {
  try {
    const invoice = await invoicesService.getInvoice(request.params.id);

    if (!invoice) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Unknown Invoice Data'
      );
    }

    return response.status(200).json(invoice);
  } catch (error) {
    return next(error);
  }
}

async function createInvoice(request, response, next) {
  try {
    const bill_to = request.body.bill_to;
    const total = request.body.total;
    const paid = request.body.paid;

    const success = await invoicesService.createInvoice(bill_to, total, paid);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create invoice'
      );
    }

    return response.status(200).json({ bill_to, total, paid });
  } catch (error) {
    return next(error);
  }
}

async function updateInvoice(request, response, next) {
  try {
    const id = request.params.id;
    const bill_to = request.body.bill_to;
    const total = request.body.total;
    const paid = request.body.paid;

    const success = await invoicesService.updateInvoice(
      id,
      bill_to,
      total,
      paid
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update invoice'
      );
    }

    return response.status(200).json({ message: 'Invoice Updated' });
  } catch (error) {
    return next(error);
  }
}

async function deleteInvoice(request, response, next) {
  try {
    const id = request.params.id;

    const success = await invoicesService.deleteInvoice(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete invoice'
      );
    }

    return response.status(200).json({ message: 'Invoice Deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
