const jwt = require('jsonwebtoken');

const tokenToUsername = (token) => {
  try {
    const { username } = jwt.verify(token, process.env.SUPER_JWT_SECRET);
    return username;
  } catch (err) {
    return;
  }
};

module.exports = {
  tokenToUsername,
};
