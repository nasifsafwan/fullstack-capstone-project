import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export function requireAuth(request, response, next) {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Authentication required." });
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    request.user = payload;
    return next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid or expired token." });
  }
}

