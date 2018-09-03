const crypto = require('crypto');
const util = require('util');
const pbkdf2 = util.promisify(crypto.pbkdf2);
const db = require('../models/db');

module.exports.setPassword = password => new Promise(async (resolve, reject) => {
  try {
    const salt = crypto
      .randomBytes(16)
      .toString('hex');

    let hash = await pbkdf2(password, salt, 1000, 512, 'sha512');
    hash = hash.toString('hex');
    resolve({salt, hash});
  } catch (err) {
    reject(err);
  }
});

module.exports.validPassword = password => new Promise(async (resolve, reject) => {
  try {
    const user = db
      .get('user')
      .value();

    let hash = await pbkdf2(password, user.salt, 1000, 512, 'sha512');
    hash = hash.toString('hex');
    resolve(hash === user.hash);
  } catch (err) {
    reject(err);
  }
});
