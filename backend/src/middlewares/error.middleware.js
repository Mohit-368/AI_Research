export default function errorHandler(error, _request, response, _next) {
  if (response.headersSent) return;
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error('Unhandled request error:', error.message);
  response.status(status).json({ message: status >= 500 ? 'Internal server error' : error.message });
}
