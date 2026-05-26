const pool = require('../config/db');

const getSummaryReport = async () => {
  try {
    const request = pool.request();

    const query = `
      SELECT
        COUNT(*) as totalAssetsCount,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as activeAssetsCount,
        SUM(CASE WHEN status = 'In Repair' THEN 1 ELSE 0 END) as maintenanceAssetsCount,
        SUM(CASE WHEN status = 'Retired' THEN 1 ELSE 0 END) as retiredAssetsCount,
        ISNULL(SUM(cost), 0) as totalFinancialCost
      FROM Assets
    `;

    const result = await request.query(query);
    const summary = result.recordset[0];

    const categoryRequest = pool.request();
    const categoryQuery = `
      SELECT category, COUNT(*) as count
      FROM Assets
      GROUP BY category
      ORDER BY count DESC
    `;

    const categoryResult = await categoryRequest.query(categoryQuery);
    const departmentDistribution = categoryResult.recordset.map((row) => ({
      category: row.category,
      count: row.count,
    }));

    return {
      totalAssetsCount: summary.totalAssetsCount,
      activeAssetsCount: summary.activeAssetsCount,
      maintenanceAssetsCount: summary.maintenanceAssetsCount,
      retiredAssetsCount: summary.retiredAssetsCount,
      totalFinancialCost: summary.totalFinancialCost,
      departmentDistribution: departmentDistribution,
    };
  } catch (err) {
    console.error('[ReportService] getSummaryReport error:', err);
    throw err;
  }
};

module.exports = {
  getSummaryReport,
};
