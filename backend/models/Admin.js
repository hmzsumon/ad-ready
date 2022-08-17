const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter Your Name'],
    },

    //users
    totalUsers: {
      type: Number,
      default: 0,
    },
    activeUsers: {
      type: Number,
      default: 0,
    },
    inactiveUsers: {
      type: Number,
      default: 0,
    },

    // wallets
    mainBalance: {
      type: Number,
      default: 0,
    },

    activeBalance: {
      type: Number,
      default: 0,
    },

    withdrawBalance: {
      type: Number,
      default: 0,
    },

    profit: {
      type: Number,
      default: 0,
    },

    currentProfit: {
      type: Number,
      default: 0,
    },

    cashBack: {
      type: Number,
      default: 0,
    },
    referBonus: {
      type: Number,
      default: 0,
    },
    generationBonus: {
      type: Number,
      default: 0,
    },

    totalBonus: {
      type: Number,
      default: 0,
    },

    totalPendingDeposit: {
      amount: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    totalApprovedDeposit: {
      amount: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    totalPendingWithdraw: {
      amount: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    totalApprovedWithdraw: {
      amount: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // profit and cashback percents
    withdrawCharge: {
      type: Number,
      default: 0,
    },

    dailyProfit: {
      type: Number,
      default: 0,
    },

    cashBackPercentage: {
      type: Number,
      default: 0,
    },

    referPercentage: {
      type: Number,
      default: 0,
    },

    minimumWithdraw: {
      type: Number,
      default: 0,
    },

    minimumDeposit: {
      type: Number,
      default: 0,
    },

    //task
    givTask: {
      type: Boolean,
      default: false,
    },

    DTCompletedUserCount: {
      type: Number,
      default: 0,
    },

    DTUncompletedUserCount: {
      type: Number,
      default: 0,
    },

    totalWorkDays: {
      type: Number,
      default: 0,
    },
    todyWorkCompleted: {
      type: Number,
      default: 0,
    },

    toDayProfit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);
