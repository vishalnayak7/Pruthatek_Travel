import rateLimit from 'express-rate-limit';

const rateLimiter = ({
     windowMs = 15 * 60 * 1000, // default: 15 mins
     max = 100,                // default: 100 requests per window
     message = 'Too many requests, please try again later.',
} = {}) => {
     return rateLimit({
          windowMs,
          max,
          standardHeaders: true, // ✅ Add RateLimit headers
          legacyHeaders: false,  // ❌ Disable X-RateLimit headers
          message: {
               success: false,
               message,
          },
     });
};

export default rateLimiter;


