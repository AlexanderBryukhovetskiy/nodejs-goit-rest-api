const express = require('express');

const ctrl = require("../../controllers/contacts");

const {validateBody, isValidId} = require("../../middlewares");

const {schemas} = require("../../models/contact");

const router = express.Router();

router.get('/', ctrl.getAll);

router.get('/:contactId', isValidId, ctrl.getById);

router.post('/', validateBody(schemas.addSchema), ctrl.add);

router.put('/:contactId', isValidId, validateBody(schemas.updateSchema),  ctrl.updateById);

router.delete('/:contactId', isValidId, ctrl.deleteById);

router.patch('/:contactId/favorite', isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
