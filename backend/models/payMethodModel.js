const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PayMethodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PayMethod = mongoose.model('PayMethod', PayMethodSchema);
module.exports = PayMethod;
