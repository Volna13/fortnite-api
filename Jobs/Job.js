const { SCHEDULER_CONFIGURATION } = require('../config/jobs.config');

class Job {
  constructor(interval, logger, name) {
    this.interval = interval;
    this.logger = logger;
    this.name = name;
    this.logs = {
      WARN: '\x1b[33m',
      SUCCESS: '\x1b[32m',
      ERROR: '\x1b[31m',
    };

    this.print(`Initialized and will be started each ${this.parseTimeDelay()}`, new Date());
  }

  handler(timeStamp) {
    this.print(`NO HANDLER SPECIFIED FOR ${this.name}!`, timeStamp);
  }

  print(message, timeStamp, type = this.logs.WARN) {
    if (this.logger) {
      const printMessage = `${timeStamp.toISOString()}: [${this.name} JOB] ${message}`;
      console.log(type, printMessage);
      console.log(type, '='.repeat(printMessage.length));
    }
  }

  parseTimeDelay() {
    let msg = '';

    this.interval.split(' ').forEach((setting, index) => {
      if (setting !== '*') {
        msg += `${setting.match(/\d+/)} ${SCHEDULER_CONFIGURATION[index]}`;
      }
    });

    return msg;
  }
}

module.exports = Job;
