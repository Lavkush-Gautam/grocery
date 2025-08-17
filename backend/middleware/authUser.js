import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.cookies; // Or use userToken if that's what you set

    if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized: No token" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken; // Attach all decoded info to req.user
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ success: false, error: "Not authorized" });
    }
};

export default authUser;
