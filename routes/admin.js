const express = require('express');
const router = express.Router();
const skillsCtrl = require('../controllers/skills');
const productsCtrl = require('../controllers/products');

router.get('/', async (req, res) => {
  let msg, msgType;
  
  try {
    if (res.locals.flash.length) {
      msgType = res.locals.flash[0].type;
      msg = (msgType === 'msgfile' || msgType === 'msgskill') ? res.locals.flash[0].message : '';
      res.locals.flash.length = 0;
    }
    
    if (req.session.isAdmin) {
      res.render('admin', {
        [msgType]: msg
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error('admin-render error', err);
    res.render('login');
  }
});

router.post('/:id', async (req, res) => {
  try {
    switch (req.params.id) {
      case 'upload':
        const result = await productsCtrl.addProduct(req);
      
        if (result) {
          req.flash('msgfile', result.message);
          res.redirect('/admin');
        } else {
          throw new Error();
        }
        break;
      case 'skills':
        const resultSkill = await skillsCtrl.changeSkills(req.body);
        
        if (resultSkill) {
          req.flash('msgskill', resultSkill.message);
          res.redirect('/admin');
        } else {
          throw new Error();
        }
        break;
      default:
        console.error('admin-post error');
        throw new Error();
    }
  } catch (err) {
    console.error('admin-form error', err);
    res.render('admin');
  }
});

module.exports = router;
