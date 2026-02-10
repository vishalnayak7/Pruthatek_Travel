export function responseFormatter(req, res, next) {
    res.success = (message = null, data = null, statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            message,
            timestamp: new Date().toISOString(),
            data,
        });
    };
    res.fail = (message = null, statusCode = 400, extra) => {
        res.status(statusCode).json({
            success: false,
            message,
            timestamp: new Date().toISOString(),
            route: req.originalUrl,
            data: null,
            ...(extra ?? {}),
        });
    };
    next();
}
//# sourceMappingURL=responseFormater.js.map