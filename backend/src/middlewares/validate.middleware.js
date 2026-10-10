export default function validate(schema, source = 'body') {
  return (request, response, next) => {
    const result = schema.safeParse(request[source]);
    if (!result.success) {
      return response.status(400).json({
        message: 'Invalid request data',
        errors: result.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
      });
    }
    request[source] = result.data;
    return next();
  };
}
