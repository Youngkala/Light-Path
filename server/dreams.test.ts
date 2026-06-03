import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Create test context
function createTestContext(userId: number): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `test-user-${userId}`,
      email: `user${userId}@test.com`,
      name: `Test User ${userId}`,
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const TEST_DREAM_CONTENT = "I was flying over a beautiful landscape with golden light everywhere.";

describe("Dreams Interpreter", () => {
  describe("dreams.submit", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dreams.submit({
          dreamContent: TEST_DREAM_CONTENT,
        });
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should reject dream content shorter than 10 characters", async () => {
      const ctx = createTestContext(1);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dreams.submit({
          dreamContent: "short",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });


  });

  describe("dreams.getHistory", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dreams.getHistory();
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return array of dreams", async () => {
      const ctx = createTestContext(5);
      const caller = appRouter.createCaller(ctx);

      const dreamList = await caller.dreams.getHistory();

      expect(Array.isArray(dreamList)).toBe(true);
    });
  });

  describe("dreams.save", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dreams.save({
          dreamId: 1,
          isSaved: true,
        });
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return success response", async () => {
      const ctx = createTestContext(7);
      const caller = appRouter.createCaller(ctx);

      const saveResult = await caller.dreams.save({
        dreamId: 1,
        isSaved: true,
      });

      expect(saveResult).toBeDefined();
      expect(saveResult).toHaveProperty("success");
      expect(saveResult.success).toBe(true);
    });
  });

  describe("dreams.delete", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dreams.delete({
          dreamId: 1,
        });
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return success response", async () => {
      const ctx = createTestContext(8);
      const caller = appRouter.createCaller(ctx);

      const deleteResult = await caller.dreams.delete({
        dreamId: 999999,
      });

      expect(deleteResult).toBeDefined();
      expect(deleteResult).toHaveProperty("success");
      expect(deleteResult.success).toBe(true);
    });
  });

  describe("Dream API endpoints", () => {
    it("should have all required endpoints", async () => {
      const ctx = createTestContext(10);
      const caller = appRouter.createCaller(ctx);

      // Verify all endpoints exist
      expect(caller.dreams.submit).toBeDefined();
      expect(caller.dreams.getHistory).toBeDefined();
      expect(caller.dreams.save).toBeDefined();
      expect(caller.dreams.delete).toBeDefined();
    });
  });
});
