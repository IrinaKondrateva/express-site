const express = require('express');
const router = express.Router();
const skillsCtrl = require('../controllers/skills');
const productsCtrl = require('../controllers/products');
const sendEmailCtrl = require('../controllers/sendemail');

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const result = await Promise.all([skillsCtrl.getSkills(), productsCtrl.getProducts()]);
    const [ skills, products ] = result;
    let msg;
    
    if (res.locals.flash.length) {
      msg = res.locals.flash[0].type === 'msgsemail' ? res.locals.flash[0].message : '';
      res.locals.flash.length = 0;
    }

    res.render('index', {
      skills: skills,
      products: products,
      msgsemail: msg
    });
  } catch (err) {
    console.error('index error', err);
    res.render('index', {
      skills: [],
      products: []
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await sendEmailCtrl.sendEmail(req.body);
    
    if (result) {
      req.flash('msgsemail', result.message);
      res.redirect('/');
      return;
    } else {
      throw new Error('index-form error');
    }
  } catch (err) {
    console.error('index-form error', err);
    res.render('index');
  }
});

module.exports = router;
