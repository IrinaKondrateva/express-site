const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin');
const skillsCtrl = require('../controllers/skills');

router.get('/', async (req, res) => {
  let msg;
  let msgType;
  console.log(req.url, res.locals.flash);

  if (res.locals.flash.length) {
    msgType = res.locals.flash[0].type;
    msg = (msgType === 'msgfile' || msgType === 'msgskill') ? res.locals.flash[0].message : '';
    res.locals.flash.length = 0;
  }
  console.log(msgType, msg);
  if (req.session.isAdmin) {
    res.render('admin', {
      [msgType]: msg
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/:id', async (req, res) => {
  try {
    switch (req.params.id) {
      case 'upload':
        const result = await adminCtrl.adminProduct(req);
      
        if (result) {
          req.flash('msgfile', result.message);
          res.redirect('/admin');
          return;
        } else {
          throw new Error();
        }
      case 'skills':
        const resultSkill = await skillsCtrl.changeSkills(req.body);
        
        if (resultSkill) {
          req.flash('msgskill', resultSkill.message);
          res.redirect('/admin');
          return;
        } else {
          throw new Error();
        }
      default:
        console.log('ошибочка');
        throw new Error();
    }
  } catch (err) {
    console.error('admin-form error', err);
    res.render('admin');
  }
});

module.exports = router;
