import jwt, { Secret } from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const ensureAuthorization = (req: Request) => {
  try {
    const receivedJwt = req.headers['authorization'];

    if (typeof receivedJwt === 'string') {
      const privateKey: Secret = process.env.PRIVATE_KEY || 'default';
      let authorization = jwt.verify(receivedJwt, privateKey);
      return authorization;
    } else {
      throw new ReferenceError('jwt must be provided');
    }
  } catch (err) {
    console.log(err);
  }
};

export default ensureAuthorization;
