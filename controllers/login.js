module.exports.login = ({ email, password }) => new Promise((resolve, reject) => {
  try {
    if (!email || !password) {
      resolve({success: false, message: 'Все поля нужно заполнить!'});
      return;
    }
    if (email !== 'black@cat.com' || password !== 'cat') {
      resolve({success: false, message: 'Неверный пароль или почта'});
      return;
    }
    resolve({success: true, message: 'Осуществлен вход'});
  } catch (err) {
    reject(err);
  }
});
