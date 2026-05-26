const assetService = require('../services/assetService');

const getAssets = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status,
    };

    const assets = await assetService.getAllAssets(filters);
    res.status(200).json({ success: true, data: assets });
  } catch (err) {
    next(err);
  }
};

const getAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid asset ID' });
    }

    const asset = await assetService.getAssetById(parseInt(id, 10));
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.status(200).json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
};

const createAsset = async (req, res, next) => {
  try {
    const { asset_tag, name, category, status, location, value } = req.body;

    if (!asset_tag || !name || !category) {
      return res.status(400).json({ error: 'asset_tag, name, and category are required' });
    }

    const id = await assetService.createAsset({
      asset_tag,
      name,
      category,
      status,
      location,
      value,
    });

    res.status(201).json({ success: true, data: { id, asset_tag, name, category } });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Asset tag already exists' });
    }
    next(err);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid asset ID' });
    }

    const asset = await assetService.getAssetById(parseInt(id, 10));
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const updated = await assetService.updateAsset(parseInt(id, 10), req.body);
    if (!updated) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    res.status(200).json({ success: true, message: 'Asset updated' });
  } catch (err) {
    next(err);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid asset ID' });
    }

    const deleted = await assetService.deleteAsset(parseInt(id, 10));
    if (!deleted) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.status(200).json({ success: true, message: 'Asset deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
};
