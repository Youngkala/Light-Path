import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

// Create test context
function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as any,
  };
}

describe("Email/Password Authentication", () => {
  beforeEach(async () => {
    // Clean up test users before each test
    const db = await getDb();
    if (!db) return;
    await db.delete(users).where(eq(users.email, "test@example.com"));
    await db.delete(users).where(eq(users.email, "existing@example.com"));
  });

  describe("Signup", () => {
    it("should create a new user account with valid credentials", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.signup({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        confirmPassword: "password123",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("successfully");

      // Verify user was created in database
      const db = await getDb();
      if (!db) return;
      const userList = await db.select().from(users).where(eq(users.email, "test@example.com"));
      expect(userList.length).toBeGreaterThan(0);
      const user = userList[0];
      expect(user?.name).toBe("Test User");
      expect(user?.email).toBe("test@example.com");
    });

    it("should reject signup with invalid email format", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.signup({
          email: "invalid-email",
          name: "Test User",
          password: "password123",
          confirmPassword: "password123",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("email");
      }
    });

    it("should reject signup with mismatched passwords", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.signup({
          email: "test@example.com",
          name: "Test User",
          password: "password123",
          confirmPassword: "different123",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toContain("do not match");
      }
    });

    it("should reject signup with password too short", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.signup({
          email: "test@example.com",
          name: "Test User",
          password: "short",
          confirmPassword: "short",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("at least 6 characters");
      }
    });

    it("should reject signup with empty name", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.signup({
          email: "test@example.com",
          name: "",
          password: "password123",
          confirmPassword: "password123",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Name is required");
      }
    });

    it("should reject duplicate email registration", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Create first account
      await caller.auth.signup({
        email: "existing@example.com",
        name: "First User",
        password: "password123",
        confirmPassword: "password123",
      });

      // Try to create duplicate
      try {
        await caller.auth.signup({
          email: "existing@example.com",
          name: "Second User",
          password: "password456",
          confirmPassword: "password456",
        });
        expect.fail("Should have thrown error for duplicate email");
      } catch (error: any) {
        expect(error.message).toContain("already");
      }
    });
  });

  describe("Login", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      await caller.auth.signup({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        confirmPassword: "password123",
      });
    });

    it("should login with valid email and password", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.loginEmail({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe("test@example.com");
      expect(result.user?.name).toBe("Test User");
    });

    it("should reject login with incorrect password", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.loginEmail({
          email: "test@example.com",
          password: "wrongpassword",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toContain("Invalid");
      }
    });

    it("should reject login with non-existent email", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.loginEmail({
          email: "nonexistent@example.com",
          password: "password123",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toContain("Invalid");
      }
    });

    it("should reject login with empty password", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.loginEmail({
          email: "test@example.com",
          password: "",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("required");
      }
    });
  });

  describe("Password Reset", () => {
    beforeEach(async () => {
      // Create a test user for password reset tests
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      await caller.auth.signup({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        confirmPassword: "password123",
      });
    });

    it("should request password reset for existing email", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.requestPasswordReset({
        email: "test@example.com",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("reset link");
    });

    it("should not reveal if email exists when requesting reset", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.requestPasswordReset({
        email: "nonexistent@example.com",
      });

      // Should return success even for non-existent email (security best practice)
      expect(result.success).toBe(true);
      expect(result.message).toContain("reset link");
    });

    it("should reject password reset with invalid token", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.resetPassword({
          token: "invalid-token",
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toContain("Invalid");
      }
    });

    it("should reject password reset with mismatched passwords", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.resetPassword({
          token: "some-token",
          newPassword: "newpassword123",
          confirmPassword: "different123",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toContain("do not match");
      }
    });

    it("should reject password reset with password too short", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.resetPassword({
          token: "some-token",
          newPassword: "short",
          confirmPassword: "short",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("at least 6 characters");
      }
    });
  });

  describe("Auth Endpoints", () => {
    it("should return current user from me endpoint", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();
      expect(result).toBeNull();
    });

    it("should logout successfully", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });
  });
});
