export default function errorHandler(err, req, res, _next) {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        timestamp: new Date().toISOString(),
        data: null,
        route: req.originalUrl,
    });
}
//# sourceMappingURL=errorHandler.js.map