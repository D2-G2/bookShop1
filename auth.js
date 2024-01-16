const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req) => {
  try {
    let receivedJwt = req.headers['authorization'];

    if (receivedJwt) {
      let authorization = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
      return authorization;
    } else {
      throw new ReferenceError('jwt must be provided');
    }
  } catch (err) {
    console.log(err);

    return err;
  }
};

module.exports = { ensureAuthorization };
