const mongoose = require('mongoose');

const { Schema } = mongoose;

const opts = {
  timestamps: new Date(),
};

const UserStatSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    stat: {
      type: Object,
    },
  },
  opts,
);

module.exports = mongoose.model('UserStat', UserStatSchema);
