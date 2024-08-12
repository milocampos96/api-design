import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import { config } from "dotenv";
config();

/**
 * Compares a plain text password with a hashed password.
 *
 * @param password - The plain text password to compare.
 * @param hash - The hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePasswords = async (password, hash) => {
  return bycrypt.compare(password, hash);
};

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password) => {
  return await bycrypt.hash(password, 10);
};

/**
 * Creates a JSON Web Token (JWT) for a user.
 *
 * @param user - The user object containing the user's ID and username.
 * @returns The generated JWT.
 */
export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

/**
 * Middleware function to protect routes by verifying JWT tokens.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 * @returns If the JWT is valid, the request object will be populated with the user's payload and the next middleware function will be called.
 *          If the JWT is invalid or missing, a 401 status code will be sent with the message "Not authorized".
 */
export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    ("here");
    res.status(401);
    res.send("Not authorized");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    payload;
    next();
    return;
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send("Not authorized");
    return;
  }
};
