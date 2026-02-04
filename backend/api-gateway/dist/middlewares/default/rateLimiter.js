import rateLimit from "express-rate-limit";
const rateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests, please try again later.", } = {}) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message,
        },
    });
};
export default rateLimiter;
//# sourceMappingURL=rateLimiter.js.map