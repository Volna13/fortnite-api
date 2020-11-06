const UserStat = require('../models/userStat.model');

const NotFoundError = require('../errors/notFounterror');

exports.getCurrentStat = async (req, res) => {
  try {
    const currentuserStat = await UserStat.findOne({ userId: req.user._id }).populate(
      'userId',
      'fullName email platform epicNickname',
    );
    if (!currentuserStat) {
      throw new NotFoundError();
    } else {
      res.status(200).json(currentuserStat);
    }
    res.status(200).json({ message: 'User Stats Here' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong...' });
  }
};
