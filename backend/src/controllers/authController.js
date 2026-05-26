const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.authenticate(email, password);
    if (!result) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
};
