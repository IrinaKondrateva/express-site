const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const db = require('./db.js');
const psw = require('../libs/password');

let loginEmail = '';
let hash = '';
let salt = '';
let password = {};

rl.question('Login email: ', answer => {
  loginEmail = answer;
  rl.question('Password: ', async (answer) => {
    try {
      password = await psw.setPassword(answer);
      hash = password.hash;
      salt = password.salt;
      rl.close();
    } catch (err) {
      console.error('Ошибка при установке админа', err);
    }
  });
});

rl.on('close', () => {
  db
    .set('user', {loginEmail, hash, salt})
    .write();
});
