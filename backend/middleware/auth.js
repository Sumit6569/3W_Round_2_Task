const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Missing token");
console.log("Decoded token:", authHeader);

  try {
    const decoded = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
};
