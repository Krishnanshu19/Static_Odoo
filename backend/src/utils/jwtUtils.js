import jwt from 'jsonwebtoken';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} payload.userId - User ID
 * @param {string} payload.email - User email (optional)
 * @param {string} payload.role - User role (optional)
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn,
      issuer: 'oddo-stackit',
      audience: 'oddo-stackit-users'
    });
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Generate access token for user
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {string} Access token
 */
const generateAccessToken = (userId, email = null, role = 'user') => {
  const payload = { userId, email, role };
  return generateToken(payload, JWT_EXPIRES_IN);
};

/**
 * Generate refresh token for user
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
const generateRefreshToken = (userId) => {
  const payload = { userId, type: 'refresh' };
  return generateToken(payload, JWT_REFRESH_EXPIRES_IN);
};

/**
 * Generate both access and refresh tokens
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {Object} Object containing access and refresh tokens
 */
const generateTokenPair = (userId, email = null, role = 'user') => {
  const accessToken = generateAccessToken(userId, email, role);
  const refreshToken = generateRefreshToken(userId);
  
  return {
    accessToken,
    refreshToken
  };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Verify access token
 * @param {string} token - Access token to verify
 * @returns {Object} Verification result
 */
const verifyAccessToken = (token) => {
  const result = verifyToken(token);
  
  if (!result.valid) {
    return result;
  }
  
  // Check if it's a refresh token
  if (result.decoded.type === 'refresh') {
    return { valid: false, error: 'Invalid token type' };
  }
  
  return result;
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Verification result
 */
const verifyRefreshToken = (token) => {
  const result = verifyToken(token);
  
  if (!result.valid) {
    return result;
  }
  
  // Check if it's a refresh token
  if (result.decoded.type !== 'refresh') {
    return { valid: false, error: 'Invalid token type' };
  }
  
  return result;
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false otherwise
 */
const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  
  return new Date() > expiration;
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

export {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiration,
  isTokenExpired,
  extractTokenFromHeader
}; 