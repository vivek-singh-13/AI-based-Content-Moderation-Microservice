const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized: No token provided" });

  const token = authHeader.split(' ')[1]; // Extract token
  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized: Token expired" });
      } else {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
    }
    req.user = decoded; // Attach user to request
    next();
  });
};

module.exports = authenticateUser;


