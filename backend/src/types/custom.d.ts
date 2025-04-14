import { UserSession } from './jwtMiddleware'; // Adjust path as needed
import * as expressSession from 'express-session';

// This file is used to extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      session: UserSession & expressSession.Session;
      cookies: { access_token?: string }; // Add other cookies if needed
    }
  }
}
