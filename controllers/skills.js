const db = require('../models/db');

module.exports.getSkills = () => new Promise(async (resolve, reject) => {
  try {
    const skills = db.getState().skills || [];
    resolve(skills);
  } catch (err) {
    reject(err);
  }
});
