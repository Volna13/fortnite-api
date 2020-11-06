const request = require('request');

const User = require('../models/users.model');
const UserStat = require('../models/userStat.model');

const Job = require('./Job');

const { STATS_PARSER_INTERVAL } = require('../config/jobs.config');

class FortniteStatsJob extends Job {
  constructor(logger) {
    super(STATS_PARSER_INTERVAL, logger, 'F-NITE STATS');

    this.baseUri = 'https://api.fortnitetracker.com/v1/profile/';
    this.apiKey = '80467b99-8ae0-4f34-9e0d-536ac7b1e210';
    this.updatedUsers = [];
  }

  async handler(timeStamp) {
    this.print(`START`, timeStamp, this.logs.WARN);
    const startDate = new Date();
    const users = await User.find().select('id platform epicNickname');
    this.updatedUsers = [];
    try {
      await Promise.all(users.map((user) => this.queryStatForUser(user, timeStamp)));
      const endDate = new Date();
      this.print(
        `UPDATED ${this.updatedUsers.length} users in ${
          (endDate.getTime() - startDate.getTime()) / 1000
        } seconds. Job will restart in ${this.parseTimeDelay()}`,
        endDate,
        this.logs.SUCCESS,
      );
    } catch {
      this.print(`FAIL`, new Date(), this.logs.ERROR);
    }
  }

  queryStatForUser({ platform, epicNickname, _id }, timeStamp) {
    this.print(`Requesting stats for ${epicNickname}`, timeStamp, this.logs.WARN);
    return new Promise((res, rej) => {
      const fullUrl = encodeURI(`${this.baseUri}${platform}/${epicNickname}`);
      const options = {
        url: fullUrl,
        headers: {
          'TRN-Api-Key': this.apiKey,
        },
      };
      try {
        request(options, async (error, response, body) => {
          if (response.statusCode === 200) {
            const stats = JSON.parse(body);
            if (!stats.error) {
              await UserStat.findOneAndUpdate({ userId: _id }, { stat: stats });
              this.updatedUsers.push(epicNickname);
            } else {
              this.print(`User ${epicNickname} was not updated due to: ${stats.error}`, timeStamp, this.logs.ERROR);
            }
          } else {
            this.print(
              `User ${epicNickname} update failed. This user might be private or service is down. Please check the F-Nite website for details!`,
              timeStamp,
              this.logs.ERROR,
            );
          }

          res();
        });
      } catch (e) {
        this.print(e, timeStamp, this.logs.ERROR);
        rej();
      }
    });
  }
}

module.exports = FortniteStatsJob;
