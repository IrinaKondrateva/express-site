const db = require('../models/db.js');
const psw = require('../libs/password');

module.exports.loginValid = ({ email, password }) => new Promise(async (resolve, reject) => {
  try {
    const user = db.getState().user;

    if (!email || !password) {
      resolve({success: false, message: 'Все поля нужно заполнить!'});
      return;
    }
    if (email !== user.loginEmail || !(await psw.validPassword(password))) {
      resolve({success: false, message: 'Неверный пароль или почта'});
      return;
    }
    resolve({success: true, message: 'Осуществлен вход'});
  } catch (err) {
    reject(err);
  }
});
