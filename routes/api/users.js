const express = require('express');

const ctrl = require('../../controllers/auth');

const {schemas} = require('../../models/user');

const {validateBody} = require('../../middlewares');

const router = express.Router();

router.get('/:verificationToken', ctrl.verifyEmail);

router.post('/', validateBody(schemas.emailVerifySchema), ctrl.resendVerifyEmail);

module.exports = router;