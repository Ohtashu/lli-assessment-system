const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const findUserByEmail = async (email) => {
  try {
    const request = pool.request();
    const result = await request
      .input('email', email)
      .query('SELECT id, email, name, password_hash FROM Users WHERE email = @email');
    return result.recordset[0] || null;
  } catch (err) {
    console.error('[AuthService] findUserByEmail error:', err);
    throw err;
  }
};

const verifyPassword = async (plainPassword, hash) => {
  try {
    return await bcrypt.compare(plainPassword, hash);
  } catch (err) {
    console.error('[AuthService] verifyPassword error:', err);
    throw err;
  }
};

const signToken = (userId, email) => {
  const payload = { userId, email };
  const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-prod';
  const options = { expiresIn: process.env.JWT_EXPIRY || '7d' };
  return jwt.sign(payload, secret, options);
};

const authenticate = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return null;

  const token = signToken(user.id, user.email);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

module.exports = {
  findUserByEmail,
  verifyPassword,
  signToken,
  authenticate,
};
