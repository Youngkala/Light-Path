import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  updateUserLastSignedIn,
  createPasswordResetToken,
  getPasswordResetToken,
  deletePasswordResetToken,
} from "../db";

const SALT_ROUNDS = 10;
const PASSWORD_RESET_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: minimum 6 characters
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign up a new user
 */
export async function signup(email: string, name: string, password: string) {
  // Validate inputs
  if (!email || !name || !password) {
    throw new Error("Email, name, and password are required");
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!isValidPassword(password)) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  try {
    const result = await createUser(email, name, passwordHash);
    return result;
  } catch (error) {
    console.error("[Auth] Signup error:", error);
    throw new Error("Failed to create account");
  }
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string) {
  // Validate inputs
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Get user by email
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user has password hash (email/password auth)
  if (!user.passwordHash) {
    throw new Error("This account uses OAuth authentication. Please use the OAuth login method.");
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Update last signed in
  await updateUserLastSignedIn(user.id);

  return user;
}

/**
 * Generate password reset token
 */
export async function generatePasswordResetToken(email: string): Promise<string> {
  // Get user by email
  const user = await getUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists (security best practice)
    throw new Error("Password reset link sent to your email if account exists");
  }

  // Generate random token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS);

  // Save token to database
  await createPasswordResetToken(user.id, token, expiresAt);

  return token;
}

/**
 * Verify and use password reset token
 */
export async function resetPassword(token: string, newPassword: string) {
  // Validate new password
  if (!isValidPassword(newPassword)) {
    throw new Error("Password must be at least 6 characters");
  }

  // Get token from database
  const resetToken = await getPasswordResetToken(token);
  if (!resetToken) {
    throw new Error("Invalid or expired reset token");
  }

  // Check if token is expired
  if (new Date() > resetToken.expiresAt) {
    await deletePasswordResetToken(resetToken.id);
    throw new Error("Reset token has expired");
  }

  // Get user
  const user = await getUserById(resetToken.userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await updateUserPassword(user.id, passwordHash);

  // Delete used token
  await deletePasswordResetToken(resetToken.id);

  return user;
}

/**
 * Verify user credentials and return user object
 */
export async function verifyCredentials(email: string, password: string) {
  return login(email, password);
}
