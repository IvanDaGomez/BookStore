import jwt from 'jsonwebtoken';
// Middleware to add JWT information to the session
export const jwtMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    // Only initialize session if it doesn't exist
    if (!req.session)
        req.session = Object.assign(req.session || {}, { user: null });
    try {
        // This has other information like timeout, etc
        const info = jwt.verify(token || '', process.env.JWT_SECRET || ''); // Replace with a more specific type if needed
        req.session.user = info; // Add user info from JWT to the session
    }
    catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('JWT verification error:', error);
        }
        req.session.user = null; // Reset session user if JWT verification fails
    }
    next();
};
