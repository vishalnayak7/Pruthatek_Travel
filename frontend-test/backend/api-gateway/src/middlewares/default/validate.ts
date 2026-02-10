import { Request, Response, NextFunction } from 'express';

export default function validate(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const formatted = result.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.fail('Validation failed', 400, { errors: formatted });
    }

    req.validated = result.data; // ✅ NO ERROR after fix
    next();
  };
}
