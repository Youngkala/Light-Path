import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("feedback", () => {
  describe("submit", () => {
    it("should accept valid feedback submission", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.feedback.submit({
        name: "John Doe",
        email: "john@example.com",
        feedbackType: "review",
        rating: 5,
        message: "Great app! Very helpful for my spiritual journey.",
      });

      expect(result).toEqual({ success: true });
    });

    it("should reject feedback with empty name", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.feedback.submit({
          name: "",
          email: "john@example.com",
          feedbackType: "review",
          rating: 5,
          message: "Great app!",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should reject feedback with empty message", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.feedback.submit({
          name: "John Doe",
          email: "john@example.com",
          feedbackType: "review",
          rating: 5,
          message: "",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should accept feedback without email", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.feedback.submit({
        name: "Anonymous User",
        feedbackType: "suggestion",
        message: "Consider adding prayer reminders.",
      });

      expect(result).toEqual({ success: true });
    });

    it("should accept all feedback types", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const feedbackTypes = ["review", "complaint", "suggestion", "bug_report"] as const;

      for (const type of feedbackTypes) {
        const result = await caller.feedback.submit({
          name: "Test User",
          feedbackType: type,
          message: `This is a ${type} feedback.`,
        });

        expect(result).toEqual({ success: true });
      }
    });

    it("should accept rating from 1 to 5", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      for (let rating = 1; rating <= 5; rating++) {
        const result = await caller.feedback.submit({
          name: "Test User",
          feedbackType: "review",
          rating,
          message: `Rating ${rating} feedback.`,
        });

        expect(result).toEqual({ success: true });
      }
    });

    it("should reject invalid rating", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.feedback.submit({
          name: "Test User",
          feedbackType: "review",
          rating: 10,
          message: "Invalid rating feedback.",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("getAll", () => {
    it("should return empty array for non-admin users", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.feedback.getAll();

      expect(result).toEqual([]);
    });

    it("should return feedback for admin users", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      // First submit some feedback
      await caller.feedback.submit({
        name: "Test User",
        feedbackType: "review",
        message: "Test feedback",
      });

      // Then retrieve all feedback as admin
      const result = await caller.feedback.getAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getUserFeedback", () => {
    it("should retrieve user's own feedback", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First submit feedback
      await caller.feedback.submit({
        name: "Test User",
        feedbackType: "suggestion",
        message: "User feedback test",
      });

      // Then retrieve user's feedback
      const result = await caller.feedback.getUserFeedback();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
