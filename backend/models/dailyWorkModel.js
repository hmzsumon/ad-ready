const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyWorkSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DailyWork = mongoose.model('DailyWork', dailyWorkSchema);
module.exports = DailyWork;
