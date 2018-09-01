const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const util = require('util');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const productsCtrl = require('../controllers/products');
const skillsCtrl = require('../controllers/skills');
const validation = require('../libs/adminproduct-valid');

module.exports.adminProduct = req => new Promise(async (resolve, reject) => {
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
        console.log(photoPath, fileName);
        resolve({success: false, message: `При загрузке картинки произошла ошибка!: ${err}`});
        return;
      }

      const result = await productsCtrl.addProduct(name, price, path.join('upload', name));
      if (result.success) {
        resolve(result);
      } else {
        throw new Error('admin-product-form error');
      }
    });
  } catch (err) {
    reject(err);
  }
});
