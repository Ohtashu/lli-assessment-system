const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const assetController = require('../controllers/assetController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', assetController.getAssets);
router.post('/', assetController.createAsset);
router.get('/:id', assetController.getAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
