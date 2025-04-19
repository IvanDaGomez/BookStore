import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SessionData } from 'express-session';
import { AuthToken } from '../types/authToken';
interface UserSession {
  user: {} | null; // Replace {} with a more specific type if needed
}

// Extend the SessionData interface to include the user property
declare module 'express-session' {
  interface SessionData {
    user: { [key: string]: any } | null; // Replace {} with a more specific type if needed
  }
}

// Middleware to add JWT information to the session
export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.access_token;

  // Only initialize session if it doesn't exist
  if (!req.session) req.session = Object.assign(req.session || {}, { user: null });

  try {
    // This has other information like timeout, etc
    const info = jwt.verify(token || '', process.env.JWT_SECRET || '') as AuthToken // Replace with a more specific type if needed

    req.session.user = info; // Add user info from JWT to the session
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('JWT verification error:', error);
    }
    req.session.user = null; // Reset session user if JWT verification fails
  }

  next();
};