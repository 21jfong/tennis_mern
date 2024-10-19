import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, 'test');

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      const user = await User.findOne({ email: decodedData.email });
      req.userId = user.id.toString();
    }

    next();
  } catch (error) {
    console.log(error);
  }
}

export default auth;