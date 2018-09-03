const db = require('../models/db');

module.exports.getSkills = () => new Promise(async (resolve, reject) => {
  try {
    const skills = db.getState().skills || [];
    resolve(skills);
  } catch (err) {
    reject(err);
  }
});

module.exports.changeSkills = objForm => new Promise(async (resolve, reject) => {
  try {
    const newNumSkills = Object.values(objForm);
    const skills = await this.getSkills();

    if (!newNumSkills.every(item => !!item)) {
      return resolve({success: false, message: 'Все поля нужно заполнить!'});
    }
    
    skills.forEach((item, index) => {
      item.number = newNumSkills[index];
    });
    
    db.set('skills', skills).write();
    resolve({success: true, message: 'Счетчики изменены!'});
  } catch (err) {
    reject(err);
  }
});
