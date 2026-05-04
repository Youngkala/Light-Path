import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  getUserPrayers, createPrayer, updatePrayer, deletePrayer,
  getUserHabits, createHabit, deleteHabit,
  logHabitCompletion, getHabitLogs,
  getDevotionals, getDevotionalById, getUserBookmarkedDevotionals, bookmarkDevotional, removeBookmark,
  getUserBibleChapters, createOrUpdateBibleChapter,
  createChatSession, getUserChatSessions, getActiveChatSession, getSessionMessages, saveAIChat, clearSessionMessages, getUserAIChatHistory, getSessionById,
  getDailyVerse,
  submitFeedback, getAllFeedback, getUserFeedback
} from "./db";
import { invokeLLM } from "./_core/llm";
import { sendFeedbackEmail } from "./_core/emailService";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Prayer Journal endpoints
  prayers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserPrayers(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        content: z.string().min(1),
        category: z.string().default("general")
      }))
      .mutation(async ({ ctx, input }) => {
        await createPrayer(ctx.user.id, input.content, input.category);
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        content: z.string().optional(),
        category: z.string().optional(),
        isAnswered: z.boolean().optional(),
        answeredAt: z.date().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await updatePrayer(id, updates);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePrayer(input.id);
        return { success: true };
      }),
  }),

  // Habit Tracker endpoints
  habits: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserHabits(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().default("heart")
      }))
      .mutation(async ({ ctx, input }) => {
        await createHabit(ctx.user.id, input.name, input.description, input.icon);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteHabit(input.id);
        return { success: true };
      }),
    logCompletion: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .mutation(async ({ input }) => {
        await logHabitCompletion(input.habitId);
        return { success: true };
      }),
    getLogs: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .query(async ({ input }) => {
        return getHabitLogs(input.habitId);
      }),
  }),

  // Devotionals endpoints
  devotionals: router({
    list: protectedProcedure.query(async () => {
      return getDevotionals();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getDevotionalById(input.id);
      }),
    bookmark: protectedProcedure
      .input(z.object({ devotionalId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await bookmarkDevotional(ctx.user.id, input.devotionalId);
        return { success: true };
      }),
    removeBookmark: protectedProcedure
      .input(z.object({ devotionalId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await removeBookmark(ctx.user.id, input.devotionalId);
        return { success: true };
      }),
    getBookmarks: protectedProcedure.query(async ({ ctx }) => {
      return getUserBookmarkedDevotionals(ctx.user.id);
    }),
  }),

  // Bible Reading Plan endpoints
  bibleReadingPlan: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserBibleChapters(ctx.user.id);
    }),
    updateChapter: protectedProcedure
      .input(z.object({
        book: z.string(),
        chapter: z.number(),
        isCompleted: z.boolean(),
        notes: z.string().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        await createOrUpdateBibleChapter(ctx.user.id, input.book, input.chapter, input.isCompleted, input.notes);
        return { success: true };
      }),
  }),

  // AI Spiritual Mentor endpoints with session management
  spiritualMentor: router({
    createSession: protectedProcedure.mutation(async ({ ctx }) => {
      const session = await createChatSession(ctx.user.id);
      return { success: true, sessionId: session.id };
    }),
    getSessions: protectedProcedure.query(async ({ ctx }) => {
      return getUserChatSessions(ctx.user.id);
    }),
    getActiveSession: protectedProcedure.query(async ({ ctx }) => {
      return getActiveChatSession(ctx.user.id);
    }),
    getMessages: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getSessionMessages(input.sessionId, ctx.user.id);
      }),
    chat: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        message: z.string().min(1)
      }))
      .mutation(async ({ ctx, input }) => {
        const messages = await getSessionMessages(input.sessionId);
        const recentMessages = messages.slice(-5);

        const systemPrompt = `You are LightPath Spiritual Mentor, a compassionate and scripture-grounded AI assistant. Your role is to provide spiritual guidance rooted in Christian faith and Biblical wisdom. Always respond with kindness, compassion, and encouragement. Ground your responses in Scripture when relevant. Suggest Bible verses that relate to the user's concerns. Provide spiritual wisdom and guidance. Be supportive and uplifting. Avoid harmful or inappropriate content. Focus on spiritual growth and faith development.`;

        const messageHistory: any[] = [
          { role: "system", content: systemPrompt },
          ...recentMessages.map(msg => [
            { role: "user" as const, content: msg.userMessage },
            { role: "assistant" as const, content: msg.assistantResponse }
          ]).flat(),
          { role: "user", content: input.message }
        ];

        const response = await invokeLLM({ messages: messageHistory });
        const assistantMessage = response.choices?.[0]?.message?.content as string || "I'm here to support your spiritual journey. Please share what's on your heart.";

        await saveAIChat(input.sessionId, ctx.user.id, input.message, assistantMessage);

        return { response: assistantMessage };
      }),
    clearChat: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await clearSessionMessages(input.sessionId, ctx.user.id);
        return { success: true };
      }),
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return getUserAIChatHistory(ctx.user.id);
    }),
  }),

  // Daily Verse endpoint
  dailyVerse: router({
    get: publicProcedure.query(async () => {
      const verse = await getDailyVerse();
      if (!verse) {
        return {
          verseReference: "Psalm 23:1",
          verseText: "The Lord is my shepherd, I shall not want."
        };
      }
      return verse;
    }),
  }),

  // User Settings endpoints
  settings: router({
    updateNotifications: protectedProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return { success: true };
      }),
    updateTheme: protectedProcedure
      .input(z.object({ darkMode: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return { success: true };
      }),
  }),

  // Feedback endpoints
  feedback: router({
    submit: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        feedbackType: z.enum(["review", "complaint", "suggestion", "bug_report"]),
        rating: z.number().min(1).max(5).optional(),
        message: z.string().min(1)
      }))
      .mutation(async ({ ctx, input }) => {
        // Map bug_report to bug for email service
        const feedbackType = input.feedbackType === "bug_report" ? "bug" : input.feedbackType;
        
        // Save to database
        await submitFeedback({
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          feedbackType: input.feedbackType,
          rating: input.rating,
          message: input.message
        });
        
        // Send email notification
        await sendFeedbackEmail({
          name: input.name,
          email: input.email,
          feedbackType: feedbackType as "review" | "complaint" | "suggestion" | "bug",
          rating: input.rating || 0,
          message: input.message,
          submittedAt: new Date()
        });
        
        return { success: true };
      }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can view all feedback
      if (ctx.user.role !== "admin") {
        return [];
      }
      return getAllFeedback();
    }),
    getUserFeedback: protectedProcedure.query(async ({ ctx }) => {
      return getUserFeedback(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
