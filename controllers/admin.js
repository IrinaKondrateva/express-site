const skillsCtrl = require('./skills');
const productsCtrl = require('./products');

module.exports.admin = async (req, res) => {
  let msg, msgType;
  
  try {
    if (res.locals.flash.length) {
      msgType = res.locals.flash[0].type;
      msg = (msgType === 'msgfile' || msgType === 'msgskill') ? res.locals.flash[0].message : '';
      res.locals.flash.length = 0;
    }
    console.log('msgType, msg', { [msgType]: msg });
    console.log(req.session.isAdmin);
    
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
};

module.exports.changeIndexItems = async (req, res) => {
  try {
    console.log(req.originalUrl);
    switch (req.originalUrl) {
      case '/admin/upload':
        const result = await productsCtrl.addProduct(req);
      
        if (result) {
          req.flash('msgfile', result.message);
          res.redirect('/admin');
        } else {
          throw new Error();
        }
        break;
      case '/admin/skills':
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
};
