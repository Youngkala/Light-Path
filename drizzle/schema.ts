import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  notificationsEnabled: boolean("notificationsEnabled").default(true).notNull(),
  darkModeEnabled: boolean("darkModeEnabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Prayer Journal - Store user prayers with categories and answered status
 */
export const prayers = mysqlTable("prayers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 64 }).default("general").notNull(),
  isAnswered: boolean("isAnswered").default(false).notNull(),
  answeredAt: timestamp("answeredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = typeof prayers.$inferInsert;

/**
 * Habits - Track spiritual disciplines like prayer, Bible reading, fasting
 */
export const habits = mysqlTable("habits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }).default("heart").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = typeof habits.$inferInsert;

/**
 * Habit Logs - Track daily completion of habits with streaks
 */
export const habitLogs = mysqlTable("habitLogs", {
  id: int("id").autoincrement().primaryKey(),
  habitId: int("habitId").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = typeof habitLogs.$inferInsert;

/**
 * Devotionals - Daily or curated devotional content
 */
export const devotionals = mysqlTable("devotionals", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }),
  verseReference: varchar("verseReference", { length: 255 }),
  verseText: text("verseText"),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Devotional = typeof devotionals.$inferSelect;
export type InsertDevotional = typeof devotionals.$inferInsert;

/**
 * Devotional Bookmarks - Track which devotionals users have bookmarked
 */
export const devotionalBookmarks = mysqlTable("devotionalBookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  devotionalId: int("devotionalId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DevotionalBookmark = typeof devotionalBookmarks.$inferSelect;
export type InsertDevotionalBookmark = typeof devotionalBookmarks.$inferInsert;

/**
 * Bible Chapters - Track Bible reading plan progress
 */
export const bibleChapters = mysqlTable("bibleChapters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  book: varchar("book", { length: 64 }).notNull(),
  chapter: int("chapter").notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  notes: text("notes"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BibleChapter = typeof bibleChapters.$inferSelect;
export type InsertBibleChapter = typeof bibleChapters.$inferInsert;

/**
 * AI Chat History - Store conversations with the Spiritual Mentor
 */
export const aiChats = mysqlTable("aiChats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userMessage: text("userMessage").notNull(),
  assistantResponse: text("assistantResponse").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIChat = typeof aiChats.$inferSelect;
export type InsertAIChat = typeof aiChats.$inferInsert;

/**
 * Daily Verses - Store daily Bible verses for the dashboard
 */
export const dailyVerses = mysqlTable("dailyVerses", {
  id: int("id").autoincrement().primaryKey(),
  verseReference: varchar("verseReference", { length: 255 }).notNull(),
  verseText: text("verseText").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyVerse = typeof dailyVerses.$inferSelect;
export type InsertDailyVerse = typeof dailyVerses.$inferInsert;