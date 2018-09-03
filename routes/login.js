const express = require('express');
const router = express.Router();
const loginCtrl = require('../controllers/login');

router.get('/', loginCtrl.login);
router.post('/', loginCtrl.auth);

module.exports = router;
