const { Invoice } = require('../../../models');

async function getInvoices() {
  return Invoice.find({});
}

async function getInvoice(id) {
  return Invoice.findById(id);
}

async function createInvoice(bill_to, total, paid) {
  return Invoice.create({ bill_to, total, paid });
}

async function updateInvoice(id, bill_to, total, paid) {
  return Invoice.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        bill_to,
        total,
        paid,
      },
    }
  );
}

async function deleteInvoice(id) {
  return Invoice.deleteOne({ _id: id });
}

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
