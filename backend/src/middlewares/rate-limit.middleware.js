const buckets = new Map();

// A small in-memory limiter is appropriate for a single-process development deployment.
// Use a shared store such as Redis before running multiple instances.
export default function rateLimit({ windowMs = 60_000, max = 10 } = {}) {
  return (request, response, next) => {
    const key = request.user?._id?.toString() || request.ip;
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    if (buckets.size > 10_000) {
      for (const [bucketKey, value] of buckets) {
        if (now >= value.resetAt) buckets.delete(bucketKey);
      }
    }
    response.setHeader('RateLimit-Limit', String(max));
    response.setHeader('RateLimit-Remaining', String(Math.max(0, max - bucket.count)));
    if (bucket.count > max) {
      response.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
      return response.status(429).json({ message: 'Too many requests. Try again later.' });
    }
    return next();
  };
}
