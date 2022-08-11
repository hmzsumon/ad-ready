const Transaction = require('../models/transactionModel');

//create a transaction function
const createTransaction = (userId, transactionType, amount, description) => {
  // check isCashIn or isCashOut
  let isCashIn = false;
  let isCashOut = false;

  if (transactionType === 'cashIn') {
    isCashIn = true;
  }

  if (transactionType === 'cashOut') {
    isCashOut = true;
  }

  const transaction = new Transaction({
    userId,
    transactionType,
    amount,
    description,
    isCashIn,
    isCashOut,
  });

  return transaction.save();
};

module.exports = createTransaction;
