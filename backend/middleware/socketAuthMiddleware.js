const jwt = require('jsonwebtoken');
const { userStore } = require('../config/store');

const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(
      cleanToken,
      process.env.JWT_SECRET || 'codesync_jwt_secret_key_super_secure_2026'
    );

    const user = await userStore.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor || '#3b82f6'
    };

    next();
  } catch (err) {
    console.error('[Socket Auth Error]', err.message);
    next(new Error('Authentication error: Invalid or expired token'));
  }
};

module.exports = socketAuth;
