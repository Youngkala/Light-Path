import { describe, expect, it, beforeEach } from "vitest";
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

describe("Chat Session Management", () => {
  it("should create a new chat session", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spiritualMentor.createSession();

    expect(result.success).toBe(true);
    expect(result.sessionId).toBeDefined();
    expect(typeof result.sessionId).toBe("number");
  });

  it("should retrieve user's chat sessions", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    // Create a session first
    await caller.spiritualMentor.createSession();

    // Get sessions
    const sessions = await caller.spiritualMentor.getSessions();

    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBeGreaterThan(0);
  });

  it("should get the active chat session", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    // Create a session
    await caller.spiritualMentor.createSession();

    // Get active session
    const activeSession = await caller.spiritualMentor.getActiveSession();

    expect(activeSession).toBeDefined();
    expect(activeSession?.userId).toBe(userId);
    expect(activeSession?.isActive).toBe(true);
  });

  it("should retrieve message history for a session", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    // Create a session
    const sessionResult = await caller.spiritualMentor.createSession();
    const sessionId = sessionResult.sessionId;

    // Send a message
    await caller.spiritualMentor.chat({
      sessionId,
      message: "Hello, Spiritual Mentor",
    });

    // Get messages
    const messages = await caller.spiritualMentor.getMessages({ sessionId });

    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toHaveProperty("userMessage");
    expect(messages[0]).toHaveProperty("assistantResponse");
  });

  it("should clear all messages from a session", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    // Create a session and send messages
    const sessionResult = await caller.spiritualMentor.createSession();
    const sessionId = sessionResult.sessionId;

    await caller.spiritualMentor.chat({
      sessionId,
      message: "First message",
    });

    // Verify messages exist
    let messages = await caller.spiritualMentor.getMessages({ sessionId });
    expect(messages.length).toBeGreaterThan(0);

    // Clear chat
    const clearResult = await caller.spiritualMentor.clearChat({ sessionId });
    expect(clearResult.success).toBe(true);

    // Verify messages are cleared
    messages = await caller.spiritualMentor.getMessages({ sessionId });
    expect(messages.length).toBe(0);
  });

  it("should maintain separate sessions for different users", async () => {
    const user1Ctx = createTestContext(1);
    const user2Ctx = createTestContext(2);
    
    const caller1 = appRouter.createCaller(user1Ctx);
    const caller2 = appRouter.createCaller(user2Ctx);

    // Create sessions for different users
    await caller1.spiritualMentor.createSession();
    await caller2.spiritualMentor.createSession();

    // Get sessions for each user
    const sessions1 = await caller1.spiritualMentor.getSessions();
    const sessions2 = await caller2.spiritualMentor.getSessions();

    // Each user should only see their own sessions
    expect(sessions1.length).toBeGreaterThan(0);
    expect(sessions2.length).toBeGreaterThan(0);
    expect(sessions1.every((s: any) => s.userId === 1)).toBe(true);
    expect(sessions2.every((s: any) => s.userId === 2)).toBe(true);
  });

  it("should persist messages across multiple queries", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    // Create a session
    const sessionResult = await caller.spiritualMentor.createSession();
    const sessionId = sessionResult.sessionId;

    // Send a message
    await caller.spiritualMentor.chat({
      sessionId,
      message: "First message",
    });

    // Query messages multiple times
    const history1 = await caller.spiritualMentor.getMessages({ sessionId });
    const history2 = await caller.spiritualMentor.getMessages({ sessionId });

    // Both queries should return the same data
    expect(history1.length).toBeGreaterThan(0);
    expect(history2.length).toBeGreaterThan(0);
    expect(history1.length).toBe(history2.length);
  });

  it("should validate message input", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    // Create a session
    const sessionResult = await caller.spiritualMentor.createSession();
    const sessionId = sessionResult.sessionId;

    // Try to send an empty message - should fail validation
    try {
      await caller.spiritualMentor.chat({
        sessionId,
        message: "",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      // Expected to fail validation
      expect(error).toBeDefined();
      expect(error.message).toContain("Too small");
    }
  });

  it("should return consistent session data", async () => {
    const userId = 1;
    const ctx = createTestContext(userId);
    const caller = appRouter.createCaller(ctx);

    // Create a session
    const createResult = await caller.spiritualMentor.createSession();
    const sessionId = createResult.sessionId;

    // Get the session via getSessions
    const sessions = await caller.spiritualMentor.getSessions();
    const foundSession = sessions.find((s: any) => s.id === sessionId);

    expect(foundSession).toBeDefined();
    expect(foundSession?.userId).toBe(userId);
    expect(foundSession?.isActive).toBe(true);
  });

  it("should enforce authorization on message retrieval", async () => {
    const user1Ctx = createTestContext(1);
    const user2Ctx = createTestContext(2);
    
    const caller1 = appRouter.createCaller(user1Ctx);
    const caller2 = appRouter.createCaller(user2Ctx);

    // User 1 creates a session
    const sessionResult = await caller1.spiritualMentor.createSession();
    const sessionId = sessionResult.sessionId;

    // User 2 tries to access User 1's session - should fail
    try {
      await caller2.spiritualMentor.getMessages({ sessionId });
      expect.fail("Should have thrown authorization error");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("should enforce authorization on clear chat", async () => {
    const user1Ctx = createTestContext(1);
    const user2Ctx = createTestContext(2);
    
    const caller1 = appRouter.createCaller(user1Ctx);
    const caller2 = appRouter.createCaller(user2Ctx);

    // User 1 creates a session
    const sessionResult = await caller1.spiritualMentor.createSession();
    const sessionId = sessionResult.sessionId;

    // User 2 tries to clear User 1's session - should fail
    try {
      await caller2.spiritualMentor.clearChat({ sessionId });
      expect.fail("Should have thrown authorization error");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toContain("Unauthorized");
    }
  });
});
