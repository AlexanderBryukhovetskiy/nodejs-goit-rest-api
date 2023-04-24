const express = require('express');

const ctrl = require("../../controllers/auth");

const {validateBody, authenticate} = require("../../middlewares");

const {schemas} = require("../../models/user");

const router = express.Router();


//signup
router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

//signin
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

//current
router.get('/current', authenticate, ctrl.getCurrent);

//logout
router.post('/logout', authenticate, ctrl.logout);

//update user.subscription
router.patch(
  "/", 
  authenticate, 
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router; 