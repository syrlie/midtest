const invoicesRepository = require('./invoices-repository');

async function getInvoices({ page_number = 1, page_size = 10, sort, search }) {
  let invoices = await invoicesRepository.getInvoices();
  if (search) {
    const [field, key] = search.split(':');
    if (field === 'bill_to' || field === 'paid') {
      invoices = invoices.filter((invoice) =>
        invoice[field].toLowerCase().includes(key.toLowerCase())
      );
    }
  }

  if (sort) {
    const [field, order] = sort.split(':');
    const isValidField = field === 'bill_to' || field === 'paid';
    const isValidOrder = order === 'asc' || order === 'desc';

    if (isValidField && isValidOrder) {
      invoices.sort((a, b) => {
        if (order === 'asc') {
          return a[field].localeCompare(b[field]);
        } else {
          return b[field].localeCompare(a[field]);
        }
      });
    }
  }

  const totalItems = invoices.length;
  const totalPages = Math.ceil(totalItems / page_size);
  const startIndex = (page_number - 1) * page_size;
  const endIndex = Math.min(startIndex + page_size, totalItems);
  const paginatedInvoices = invoices.slice(startIndex, endIndex);

  return {
    page_number,
    page_size,
    count: totalItems,
    total_pages: totalPages,
    has_previous_page: page_number > 1,
    has_next_page: endIndex < totalItems,
    data: paginatedInvoices.map((invoice) => ({
      id: invoice.id,
      bill_to: invoice.bill_to,
      total: invoice.total,
      paid: invoice.paid,
    })),
  };
}

async function getInvoice(id) {
  const invoice = await invoicesRepository.getInvoice(id);

  if (!invoice) {
    return null;
  }

  return {
    id: invoice.id,
    bill_to: invoice.bill_to,
    total: invoice.total,
    paid: invoice.paid,
  };
}

async function createInvoice(bill_to, total, paid) {
  try {
    await invoicesRepository.createInvoice(bill_to, total, paid);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateInvoice(id, bill_to, total, paid) {
  const invoice = await invoicesRepository.getInvoice(id);

  if (!invoice) {
    return null;
  }

  try {
    await invoicesRepository.updateInvoice(id, bill_to, total, paid);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteInvoice(id) {
  const invoice = await invoicesRepository.getInvoice(id);

  if (!invoice) {
    return null;
  }

  try {
    await invoicesRepository.deleteInvoice(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
