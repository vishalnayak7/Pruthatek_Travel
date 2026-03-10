export default function internalAuth(req, res, next) {
  const secret = req.headers["x-internal-secret"];

  if (!secret || secret !== process.env.INTERNAL_SERVICE_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: internal service access only"
    });
  }

  next();
}
