const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const depositSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: [
        'VALID',
        'PENDING',
        'FAILED',
        'CANCELLED',
        'UNATTEMPTED',
        'EXPIRED',
        'TEMPERED',
        'INVALID_TRANSACTION',
        'VALIDATED',
        'SUCCESS',
      ],
      default: 'PENDING',
    },

    userName: {
      type: String,
      required: true,
    },
    userFullName: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },

    accountNumber: { type: String, required: true },
    transactionId: {
      type: String,
      unique: true,
      required: true,
      dropDups: true,
    },
    currency: { type: String, default: 'BDT' },
    numberOfDeposit: { type: Number, default: 0 },
    method: { type: String, required: true },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

// export default mongoose.model('Deposit', depositSchema);
module.exports = mongoose.model('Deposit', depositSchema);
