const loginValidCtrl = require('../libs/login-valid');

module.exports.login = async (req, res) => {
  let msg, msgType;

  try {
    if (res.locals.flash.length) {
      msgType = res.locals.flash[0].type;
      msg = msgType === 'msgslogin' ? res.locals.flash[0].message : '';
      res.locals.flash.length = 0;
    }
    res.render('login', {
      [msgType]: msg
    });
  } catch (err) {
    console.error('login-render error', err);
    res.render('login');
  }
};

module.exports.auth = async (req, res) => {
  try {
    const result = await loginValidCtrl.loginValid(req.body);

    if (result && result.success) {
      req.session.isAdmin = true;

      return res.redirect('/admin');
    } else if (result && !result.success) {
      req.flash('msgslogin', result.message);

      return res.redirect('/login');
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error('login-form error', err);
    res.render('login');
  }
};
