export function validate(schema) {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Update with validated and coerced data
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;

      next();
    } catch (err) {
      if (err.errors) {
        const details = err.errors.map((e) => ({
          field: e.path.slice(1).join(".") || e.path.join("."),
          message: e.message,
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            details,
          },
        });
      }
      next(err);
    }
  };
}
