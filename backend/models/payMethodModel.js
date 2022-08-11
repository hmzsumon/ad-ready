const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PayMethodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      enum: ['personal', 'agent'],
      default: 'personal',
    },
  },
  {
    timestamps: true,
  }
);

const PayMethod = mongoose.model('PayMethod', PayMethodSchema);
module.exports = PayMethod;
