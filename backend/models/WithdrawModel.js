const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WithdrawSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    withdrawCharge: {
      type: Number,
      default: 0,
    },
    netAmount: {
      type: Number,
      default: 0,
    },
    tex: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'success',
        'approved',
        'failed',
        'cancelled',
        'required',
      ],
      default: 'pending',
    },
    approvedAt: {
      type: Date,
    },
    numberOfWithdraw: {
      type: Number,
      default: 0,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedByName: {
      type: String,
    },
    approvedAccountNumber: {
      type: String,
    },
    approveTnxId: {
      type: String,
    },
    remainingBalance: {
      type: Number,
      default: 0,
    },
    balanceFrom: {
      type: String,
      default: 'Profit',
    },
    cancelDescription: {
      type: String,
      default: 'Withdrawal rules have been violated.',
    },
  },
  {
    timestamps: true,
  }
);

const Withdraw = mongoose.model('Withdraw', WithdrawSchema);
module.exports = Withdraw;
