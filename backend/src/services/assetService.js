const pool = require('../config/db');

const getAllAssets = async (filters = {}) => {
  try {
    const request = pool.request();
    let query = 'SELECT id, asset_tag, name, category, status, location, value, created_at, updated_at FROM Assets WHERE 1=1';

    if (filters.category) {
      query += ' AND category = @category';
      request.input('category', filters.category);
    }

    if (filters.status) {
      query += ' AND status = @status';
      request.input('status', filters.status);
    }

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('[AssetService] getAllAssets error:', err);
    throw err;
  }
};

const getAssetById = async (id) => {
  try {
    const request = pool.request();
    const result = await request
      .input('id', id)
      .query('SELECT id, asset_tag, name, category, status, location, value, created_at, updated_at FROM Assets WHERE id = @id');
    return result.recordset[0] || null;
  } catch (err) {
    console.error('[AssetService] getAssetById error:', err);
    throw err;
  }
};

const createAsset = async (assetData) => {
  try {
    const request = pool.request();
    const result = await request
      .input('asset_tag', assetData.asset_tag)
      .input('name', assetData.name)
      .input('category', assetData.category)
      .input('status', assetData.status || 'Active')
      .input('location', assetData.location || null)
      .input('value', assetData.value || 0)
      .query(`
        INSERT INTO Assets (asset_tag, name, category, status, location, value)
        VALUES (@asset_tag, @name, @category, @status, @location, @value);
        SELECT CAST(SCOPE_IDENTITY() as int) as id;
      `);
    return result.recordset[0].id;
  } catch (err) {
    console.error('[AssetService] createAsset error:', err);
    throw err;
  }
};

const updateAsset = async (id, updates) => {
  try {
    const request = pool.request().input('id', id);
    let query = 'UPDATE Assets SET ';
    const updateFields = [];

    if (updates.name !== undefined) {
      updateFields.push('name = @name');
      request.input('name', updates.name);
    }
    if (updates.category !== undefined) {
      updateFields.push('category = @category');
      request.input('category', updates.category);
    }
    if (updates.status !== undefined) {
      updateFields.push('status = @status');
      request.input('status', updates.status);
    }
    if (updates.location !== undefined) {
      updateFields.push('location = @location');
      request.input('location', updates.location);
    }
    if (updates.value !== undefined) {
      updateFields.push('value = @value');
      request.input('value', updates.value);
    }

    if (updateFields.length === 0) return false;

    query += updateFields.join(', ') + ', updated_at = GETDATE() WHERE id = @id';
    await request.query(query);
    return true;
  } catch (err) {
    console.error('[AssetService] updateAsset error:', err);
    throw err;
  }
};

const deleteAsset = async (id) => {
  try {
    const request = pool.request();
    const result = await request
      .input('id', id)
      .query('DELETE FROM Assets WHERE id = @id; SELECT @@ROWCOUNT as affectedRows;');
    return result.recordset[0].affectedRows > 0;
  } catch (err) {
    console.error('[AssetService] deleteAsset error:', err);
    throw err;
  }
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
