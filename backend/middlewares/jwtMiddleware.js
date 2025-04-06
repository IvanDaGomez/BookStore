import jwt from 'jsonwebtoken'
export const jwtMiddleware = (req, res, next) => {
  // eslint-disable-next-line dot-notation
  const token = req.cookies.access_token
  // Only reset req.session.user if it doesn't already exist
  if (!req.session) req.session = { user: null }

  try {
    const info = jwt.verify(token, process.env.JWT_SECRET)

    req.session.user = info // Update session with user info from token
  } catch (error) {
    // Do nothing if an error occurs
  }

  next()
}
