export default function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    data: null,
    route: req.originalUrl,
  });
}
