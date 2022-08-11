const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    transactionType: {
      type: String,
      enum: ['cashIn', 'cashOut'],
      required: true,
    },
    isCashIn: {
      type: Boolean,
      default: false,
    },
    isCashOut: {
      type: Boolean,
      default: false,
    },

    amount: { type: Number, required: true },

    currency: { type: String, default: 'USD' },
    description: { type: String, default: 'Transaction' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
