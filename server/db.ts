import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, prayers, InsertPrayer, habits, habitLogs, 
  devotionals, devotionalBookmarks, bibleChapters, aiChats, dailyVerses,
  chatSessions
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Prayer Journal queries
export async function getUserPrayers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prayers).where(eq(prayers.userId, userId)).orderBy(prayers.createdAt);
}

export async function createPrayer(userId: number, content: string, category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(prayers).values({ userId, content, category });
}

export async function updatePrayer(prayerId: number, updates: Partial<InsertPrayer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(prayers).set(updates).where(eq(prayers.id, prayerId));
}

export async function deletePrayer(prayerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(prayers).where(eq(prayers.id, prayerId));
}

// Habit queries
export async function getUserHabits(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(habits).where(eq(habits.userId, userId));
}

export async function createHabit(userId: number, name: string, description?: string, icon?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(habits).values({ userId, name, description, icon });
}

export async function deleteHabit(habitId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(habits).where(eq(habits.id, habitId));
}

// Habit Log queries
export async function logHabitCompletion(habitId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(habitLogs).values({ habitId });
}

export async function getHabitLogs(habitId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(habitLogs).where(eq(habitLogs.habitId, habitId));
}

// Devotional queries
export async function getDevotionals() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(devotionals).orderBy(devotionals.publishedAt);
}

export async function getDevotionalById(devotionalId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(devotionals).where(eq(devotionals.id, devotionalId));
  return result[0] || null;
}

// Devotional Bookmark queries
export async function getUserBookmarkedDevotionals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(devotionalBookmarks).where(eq(devotionalBookmarks.userId, userId));
}

export async function bookmarkDevotional(userId: number, devotionalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(devotionalBookmarks).values({ userId, devotionalId });
}

export async function removeBookmark(userId: number, devotionalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(devotionalBookmarks).where(and(eq(devotionalBookmarks.userId, userId), eq(devotionalBookmarks.devotionalId, devotionalId)));
}

// Bible Chapter queries
export async function getUserBibleChapters(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bibleChapters).where(eq(bibleChapters.userId, userId));
}

export async function getBibleChapter(userId: number, book: string, chapter: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(bibleChapters)
    .where(and(eq(bibleChapters.userId, userId), eq(bibleChapters.book, book), eq(bibleChapters.chapter, chapter)));
  return result[0] || null;
}

export async function createOrUpdateBibleChapter(userId: number, book: string, chapter: number, isCompleted: boolean, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getBibleChapter(userId, book, chapter);
  if (existing) {
    return db.update(bibleChapters).set({ isCompleted, notes }).where(eq(bibleChapters.id, existing.id));
  }
  return db.insert(bibleChapters).values({ userId, book, chapter, isCompleted, notes });
}

// Chat Session queries
export async function createChatSession(userId: number, title?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(chatSessions).values({ userId, title: title || "New Chat" });
  // Return the newly created session by querying it
  const sessions = await db.select().from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(chatSessions.createdAt)
    .limit(1);
  return sessions[0] || { id: 0, userId, title: title || "New Chat", isActive: true, createdAt: new Date(), updatedAt: new Date() };
}

export async function getUserChatSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatSessions).where(eq(chatSessions.userId, userId)).orderBy(chatSessions.updatedAt);
}

export async function getActiveChatSession(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(chatSessions)
    .where(and(eq(chatSessions.userId, userId), eq(chatSessions.isActive, true)))
    .orderBy(chatSessions.updatedAt)
    .limit(1);
  return result[0] || null;
}

export async function updateChatSessionTitle(sessionId: number, title: string, userId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // If userId provided, verify ownership
  if (userId) {
    const session = await db.select().from(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
      .limit(1);
    if (!session.length) {
      throw new Error("Unauthorized: Session not found or does not belong to user");
    }
  }
  
  return db.update(chatSessions).set({ title }).where(eq(chatSessions.id, sessionId));
}

// AI Chat queries
export async function saveAIChat(sessionId: number, userId: number, userMessage: string, assistantResponse: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(aiChats).values({ sessionId, userId, userMessage, assistantResponse });
}

export async function getSessionMessages(sessionId: number, userId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  // If userId provided, verify ownership
  if (userId) {
    const session = await db.select().from(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
      .limit(1);
    if (!session.length) {
      throw new Error("Unauthorized: Session not found or does not belong to user");
    }
  }
  
  return db.select().from(aiChats).where(eq(aiChats.sessionId, sessionId)).orderBy(aiChats.createdAt);
}

export async function getUserAIChatHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiChats).where(eq(aiChats.userId, userId)).orderBy(aiChats.createdAt);
}

export async function clearSessionMessages(sessionId: number, userId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // If userId provided, verify ownership
  if (userId) {
    const session = await db.select().from(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
      .limit(1);
    if (!session.length) {
      throw new Error("Unauthorized: Session not found or does not belong to user");
    }
  }
  
  return db.delete(aiChats).where(eq(aiChats.sessionId, sessionId));
}

export async function getSessionById(sessionId: number, userId?: number) {
  const db = await getDb();
  if (!db) return null;
  
  const conditions = userId 
    ? and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId))
    : eq(chatSessions.id, sessionId);
    
  const result = await db.select().from(chatSessions).where(conditions).limit(1);
  return result[0] || null;
}

// Daily Verse queries
export async function getDailyVerse() {
  const db = await getDb();
  if (!db) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = await db.select().from(dailyVerses).where(eq(dailyVerses.date, today)).limit(1);
  return result[0] || null;
}

export async function createDailyVerse(verseReference: string, verseText: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(dailyVerses).values({ verseReference, verseText });
}
