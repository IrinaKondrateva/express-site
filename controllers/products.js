const db = require('../models/db');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const util = require('util');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const validation = require('../libs/adminproduct-valid');

module.exports.getProducts = () => new Promise(async (resolve, reject) => {
  try {
    const products = db.getState().products || [];
    resolve(products);
  } catch (err) {
    reject(err);
  }
});

module.exports.addProduct = req => new Promise(async (resolve, reject) => {
  try {
    const form = new formidable.IncomingForm();
    const upload = path.join('./public', 'upload');
    
    if (!fs.existsSync('./public/upload')) {
      fs.mkdirSync('./public/upload');
    }

    form.uploadDir = path.join(process.cwd(), upload);
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
      }

      try {
        const { name, price } = fields;
        const { name: photoName, size, path: photoPath } = files.photo;
    
        const validError = validation(name, price, photoName, size);
    
        if (validError) {
          await unlink(photoPath);
          resolve({success: false, message: validError.message});
          return;
        }
        
        const fileName = path.join(process.cwd(), 'public', 'upload', name);
        const errUpload = await rename(photoPath, fileName);

        if (errUpload) {
          resolve({success: false, message: `При загрузке картинки произошла ошибка!: ${err}`});
          return;
        }

        const result = await addProductToDb(name, price, path.join('upload', name));
        if (result.success) {
          resolve(result);
        } else {
          throw new Error('product-adding error');
        }
      } catch (err) {
        throw err;
      }
    });
  } catch (err) {
    reject(err);
  }
});

const addProductToDb = (name, price, photoPath) => new Promise(async (resolve, reject) => {
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
