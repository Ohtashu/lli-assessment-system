const reportService = require('../services/reportService');

const getSummary = async (req, res, next) => {
  try {
    const report = await reportService.getSummaryReport();
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSummary,
};
