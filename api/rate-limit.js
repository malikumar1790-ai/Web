// Rate limiting middleware for API endpoints
const rateLimitStore = new Map();

export function rateLimit(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    maxRequests = 10,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req, res, next) => {
    const identifier = getClientIdentifier(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    const clientData = rateLimitStore.get(identifier) || [];
    const validRequests = clientData.filter(timestamp => timestamp > windowStart);

    if (validRequests.length >= maxRequests) {
      const oldestRequest = Math.min(...validRequests);
      const resetTime = oldestRequest + windowMs;
      const retryAfter = Math.ceil((resetTime - now) / 1000);

      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());

      return res.status(429).json({
        success: false,
        message,
        retryAfter,
        limit: maxRequests,
        windowMs
      });
    }

    // Add current request
    validRequests.push(now);
    rateLimitStore.set(identifier, validRequests);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - validRequests.length);
    res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());

    if (typeof next === 'function') {
      next();
    }
  };
}

function getClientIdentifier(req) {
  // Use IP address as identifier
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         'unknown';
}

export default rateLimit;