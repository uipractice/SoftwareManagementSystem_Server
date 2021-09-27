const router = require('express').Router();
const path = require('path');
const controller = require('../controllers/auth.controller')

router.route('/login').post(controller.login)

module.exports = router;
