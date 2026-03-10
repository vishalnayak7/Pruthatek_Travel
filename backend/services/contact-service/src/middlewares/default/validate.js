export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const formatted = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.fail('Validation failed', 400, { errors: formatted });
    
    }

    req.validated = result.data;
    next();
  };
}
