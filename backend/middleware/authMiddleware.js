import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

