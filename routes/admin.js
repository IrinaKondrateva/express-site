const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin');

router.get('/', async (req, res) => {
  let msg;
  
  if (res.locals.flash.length) {
    msg = res.locals.flash[0].type === 'msgfile' ? res.locals.flash[0].message : '';
    res.locals.flash.length = 0;
  }
  res.render('admin', {
    msgfile: msg
  });
});

router.post('/:id', async (req, res) => {
  try {
    switch (req.params.id) {
      case 'upload':
        const result = await adminCtrl.adminProduct(req);
      
        if (result) {
          req.flash('msgfile', result.message);
          res.redirect('/admin');
        } else {
          throw new Error('admin-product-form error');
        }
        break;
      case 'skills':
        await skillsCtrl.addSkill(req);
        res.redirect('/');
        break;
      default:
        throw new Error();
    }
  } catch (err) {
    console.error('admin-form error', err);
    res.render('admin');
  }
});

module.exports = router;
