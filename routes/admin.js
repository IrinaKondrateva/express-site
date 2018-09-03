const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin');

router.get('/', adminCtrl.admin);
router.post('/:id', adminCtrl.changeIndexItems);

module.exports = router;
