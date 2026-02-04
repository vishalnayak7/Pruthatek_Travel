// import jwt from 'jsonwebtoken';
// import { statusCode } from '../utils/constants/statusCode.js';

// const authenticate= (req, res, next)=>{
//     const token= req.header('Authorization')?.replace('Bearer ', '');

//     if(!token){
//         return res.status(statusCode.UNAUTHORIZED).json({message: 'Access deined. No token provided'});
//     }

//     try {
//         const decoded= jwt.verify(token, process.env.JWT_SECRET);
//         req.user= decoded;

//         next();
        
//     } catch (error) {
//         return res.status(statusCode.UNAUTHORIZED).json({message: 'Invalid or expired token'});
//     }
// };

// export default authenticate;

import jwt from 'jsonwebtoken';
import { USER_MODEL } from '../modules/user/user.model.js';
import { statusCode } from '../utils/constants/statusCode.js';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await USER_MODEL.findById(decoded.id).select("firstName lastName email");
    if (!user) {
      return res.status(statusCode.UNAUTHORIZED).json({ message: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(statusCode.UNAUTHORIZED).json({ message: "Invalid or expired token", error: err.message });
  }
};

export default authenticate;