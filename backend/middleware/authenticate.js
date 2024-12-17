import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not set in environment variables." });
    }

    try {
        console.log("Verifying token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        if (!decoded || !decoded.userId) {
            return res.status(400).json({ message: "Invalid token payload. User ID missing." });
        }

        req.userId = decoded.userId; // Attach userId to the request object
        console.log('User ID attached to req:', req.userId);

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        }

        console.error('Token Verification Error:', err);
        return res.status(500).json({ message: "An error occurred while verifying the token.", error: err.message });
    }
};

export default authenticate;
