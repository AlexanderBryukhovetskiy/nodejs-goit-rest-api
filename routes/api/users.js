const express = require('express');

const ctrl = require('../../controllers/auth');

const {schemas} = require('../../models/user');

const {validateBody} = require('../../middlewares');

const router = express.Router();

router.get('/verify/:verificationToken', ctrl.verifyEmail);

router.post('/verify', validateBody(schemas.emailVerifySchema), ctrl. resendVerifyEmail);

module.exports = router;