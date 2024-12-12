import jwt from "jsonwebtoken";

// Authorization middleware
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
