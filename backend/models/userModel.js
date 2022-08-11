const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter Your Name'],
    },

    username: {
      type: String,
      required: [true, 'Please Enter Your Username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please Enter Your Email'],
      unique: true,
    },

    phone: {
      type: String,
      required: [true, 'Please Enter Your Phone Number'],
      unique: true,
    },

    tramsAndConditions: {
      type: Boolean,
      required: [true, 'Please Accept Terms and Conditions'],
    },
    password: {
      type: String,
      required: [true, 'Please Enter Your Password'],
      minLength: [6, 'Password should have at last 6 chars'],
      select: false,
    },

    role: {
      type: String,
      default: 'user',
    },

    activeDate: {
      type: Date,
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

    dailyProfit: {
      type: Number,
      default: 0,
    },

    taskProfit: {
      type: Number,
      default: 0,
    },

    toDayProfit: {
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

    // account status

    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'suspended'],
      default: 'inactive',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    verifiedCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // sponsor
    sponsor: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      username: {
        type: String,
      },
    },

    //task
    taskLimit: {
      type: Number,
      default: 0,
    },
    taskValue: {
      type: Number,
      default: 0,
    },
    dailyTaskLimit: {
      type: Number,
      default: 0,
    },
    totalWorkDays: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    parents: [],
    children: [],

    deposit: {
      total: {
        type: Number,
        default: 0,
      },
      lastDeposit: {
        type: Number,
        default: 0,
      },
      lastDepositDate: {
        type: Date,
      },
      numberOfDeposit: {
        type: Number,
        default: 0,
      },
    },
    withdraw: {
      total: {
        type: Number,
        default: 0,
      },
      lastWithdraw: {
        type: Number,
        default: 0,
      },
      lastWithdrawDate: {
        type: Date,
      },
      numberOfWithdraw: {
        type: Number,
        default: 0,
      },
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // generate hash token and add to db
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
