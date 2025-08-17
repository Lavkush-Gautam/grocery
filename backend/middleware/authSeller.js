import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  try {
    const token = req.cookies?.sellerToken;

    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid credentials' });
    }

    req.seller = decoded; // Optional: attach seller info to request
    next();

  } catch (error) {
    console.error('authSeller error:', error.message);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

export default authSeller;
