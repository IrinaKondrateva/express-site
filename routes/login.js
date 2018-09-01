const express = require('express');
const router = express.Router();
const loginCtrl = require('../controllers/login');

router.get('/', async (req, res) => {
  let msg;
  
  if (res.locals.flash.length) {
    msg = res.locals.flash[0].type === 'msgslogin' ? res.locals.flash[0].message : '';
    res.locals.flash.length = 0;
  }
  res.render('login', {
    msgslogin: msg
  });
});

router.post('/', async (req, res) => {
  try {
    const result = await loginCtrl.login(req.body);

    if (result && result.success) {
      res.redirect('admin');
      return;
    } else if (result && !result.success) {
      req.flash('msgslogin', result.message);
      res.redirect('login');
      return;
    } else {
      throw new Error('login-form error');
    }
  } catch (err) {
    console.error('login error', err);
    res.render('login');
  }
});

module.exports = router;
