const sql = require('mssql');
const pool = require('../config/db');

const getAllAssets = async (filters = {}) => {
  try {
    const request = pool.request();
    let query = 'SELECT id, asset_tag, name, category, status, assigned_to, cost, created_at, updated_at FROM Assets WHERE 1=1';

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
      .query('SELECT id, asset_tag, name, category, status, assigned_to, cost, created_at, updated_at FROM Assets WHERE id = @id');
    return result.recordset[0] || null;
  } catch (err) {
    console.error('[AssetService] getAssetById error:', err);
    throw err;
  }
};

const createAsset = async (assetData) => {
  try {
    const assignedToValue = assetData.assigned_to ?? null;
    const costValue = Number.isFinite(Number(assetData.cost)) ? Number(assetData.cost) : 0;

    const request = pool.request();
    const result = await request
      .input('asset_tag', sql.VarChar(50), assetData.asset_tag)
      .input('name', sql.VarChar(100), assetData.name)
      .input('category', sql.VarChar(50), assetData.category)
      .input('status', sql.VarChar(20), assetData.status || 'Active')
      .input('assigned_to', sql.VarChar(100), assignedToValue)
      .input('cost', sql.Decimal(10, 2), costValue)
      .query(`
        INSERT INTO Assets (asset_tag, name, category, status, assigned_to, cost)
        VALUES (@asset_tag, @name, @category, @status, @assigned_to, @cost);
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
    if (updates.assigned_to !== undefined) {
      updateFields.push('assigned_to = @assigned_to');
      request.input('assigned_to', updates.assigned_to);
    }
    if (updates.cost !== undefined) {
      updateFields.push('cost = @cost');
      request.input('cost', updates.cost);
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
