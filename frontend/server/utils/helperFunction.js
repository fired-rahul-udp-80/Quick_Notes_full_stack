const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const jsonwebtokenId = (payload, secret, expiry) => {
    return jwt.sign(payload, secret, {
        expiresIn: expiry
    })
}

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') return false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const generateSecureOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
};


module.exports = { jsonwebtokenId, verifyToken, validatePasswordStrength, generateSecureOTP, hashOTP };