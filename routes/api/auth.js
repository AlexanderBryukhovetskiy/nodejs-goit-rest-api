const express = require('express');

const ctrl = require('../../controllers/auth');

const {validateBody, authenticate, upload} = require('../../middlewares');

const {schemas} = require('../../models/user');

const router = express.Router();


//signup
router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

//signin
router.post('/login', validateBody(schemas.loginSchema), ctrl.login) ;

//current
router.get('/current', authenticate, ctrl.getCurrent);

//logout
router.post('/logout', authenticate, ctrl.logout);

//update user.subscription
router.patch( '/', 
  authenticate, 
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.updateSubscription
);

//update user.avatar
router.patch('/avatars', 
  authenticate, 
  upload.single('avatar'), 
  ctrl.updateAvatar
);

module.exports = router; 