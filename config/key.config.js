const bcrypt = require('bcrypt');

module.exports = {
  MONGO_URI: 'mongodb://localhost:27017/fortniteApi',
  SALT: bcrypt.genSaltSync(10),
  JWTSECRET: 'fortniteApi',
};
