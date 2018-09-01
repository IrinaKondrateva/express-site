const db = require('../models/db');

module.exports.getProducts = () => new Promise(async (resolve, reject) => {
  try {
    const products = db.getState().products || [];
    resolve(products);
  } catch (err) {
    reject(err);
  }
});

module.exports.addProduct = (name, price, photoPath) => new Promise(async (resolve, reject) => {
  try {
    db
      .get('products')
      .push({
        src: photoPath,
        name,
        price
      })
      .write();
    resolve({success: true, message: 'Товар добавлен!'});
  } catch (err) {
    reject(err);
  }
});
