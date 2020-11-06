const schedule = require('node-schedule');
const FStatsJob = require('./FortniteStatsJob');

class ScheduledJobs {
  constructor() {
    this.fortniteStatsJob = new FStatsJob(true);
    this.jobs = [this.fortniteStatsJob];
  }

  runJobs() {
    this.jobs.forEach((job) => {
      schedule.scheduleJob(job.interval, (timeStamp) => job.handler(timeStamp));
    });
  }
}

module.exports = ScheduledJobs;
