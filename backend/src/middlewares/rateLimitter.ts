import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis'
import { NextFunction, Request, Response } from 'express';

const rate_limit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(10, '1 m'), // 10 requests per minute
})
async function rateLimitter(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.session?.user?.id?.toString() || req.ip;
    const { success } = await rate_limit.limit(key);
    if (!success) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}

export { rateLimitter };