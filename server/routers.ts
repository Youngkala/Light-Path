import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
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
  submitFeedback, getAllFeedback, getUserFeedback,
  getUserByEmail,
  createDream, updateDreamInterpretation, getDreamsByUserId, saveDream, deleteDream,
  getAllBibleBooks, getBibleBook, getBibleVerses, getUserBibleBookmarks, bookmarkBibleVerse, removeBookmarkBibleVerse, markChapterAsRead, getUserBibleReadingProgress, globalSearch
} from "./db";
import { invokeLLM } from "./_core/llm";
import { sendFeedbackEmail } from "./_core/emailService";
import { signup, login, generatePasswordResetToken, resetPassword } from "./_core/authService";

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
    // Email/Password Authentication
    signup: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email format"),
        name: z.string().min(1, "Name is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6),
      }))
      .mutation(async ({ input, ctx }) => {
        if (input.password !== input.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const result = await signup(input.email, input.name, input.password);
        // Get the created user
        const createdUser = await getUserByEmail(input.email);
        if (!createdUser) {
          throw new Error("Failed to retrieve created user");
        }
        // Auto-login after signup by setting session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const sessionToken = Buffer.from(JSON.stringify({ userId: createdUser.id, email: createdUser.email })).toString('base64');
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return { 
          success: true, 
          message: "Account created successfully",
          user: {
            id: createdUser.id,
            email: createdUser.email,
            name: createdUser.name,
          },
        };
      }),
    loginEmail: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await login(input.email, input.password);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const sessionToken = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64');
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      }),
    requestPasswordReset: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email format"),
      }))
      .mutation(async ({ input }) => {
        try {
          await generatePasswordResetToken(input.email);
        } catch (error) {
          // Don't reveal if email exists
        }
        return {
          success: true,
          message: "If an account exists, a password reset link has been sent to your email",
        };
      }),
    resetPassword: publicProcedure
      .input(z.object({
        token: z.string().min(1, "Reset token is required"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        if (input.newPassword !== input.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await resetPassword(input.token, input.newPassword);
        return { success: true, message: "Password reset successfully" };
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
      }))
      .mutation(async ({ ctx, input }) => {
        await updatePrayer(input.id, input);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
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
      .mutation(async ({ ctx, input }) => {
        await deleteHabit(input.id);
        return { success: true };
      }),
    logCompletion: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await logHabitCompletion(input.habitId);
        return { success: true };
      }),
    getLogs: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getHabitLogs(input.habitId);
      }),
  }),

  // Devotionals endpoints
  devotionals: router({
    list: publicProcedure.query(async () => {
      return getDevotionals();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getDevotionalById(input.id);
      }),
    getBookmarked: protectedProcedure.query(async ({ ctx }) => {
      return getUserBookmarkedDevotionals(ctx.user.id);
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
  }),

  // Bible Reading Plan endpoints
  bibleChapters: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserBibleChapters(ctx.user.id);
    }),
    createOrUpdate: protectedProcedure
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

  // AI Chat endpoints
  chat: router({
    createSession: protectedProcedure
      .input(z.object({ title: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const session = await createChatSession(ctx.user.id, input.title);
        return session;
      }),
    getSessions: protectedProcedure.query(async ({ ctx }) => {
      return getUserChatSessions(ctx.user.id);
    }),
    getMessages: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getSessionMessages(input.sessionId, ctx.user.id);
      }),
    sendMessage: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        message: z.string().min(1)
      }))
      .mutation(async ({ ctx, input }) => {
        const userMessage = input.message;
        
        // Get AI response
        const response = await invokeLLM({
          messages: [
            {
              role: "system" as const,
              content: "You are a compassionate spiritual mentor and guide. Provide wise, scripture-grounded advice that helps users grow in their faith and spiritual journey. Be warm, encouraging, and deeply thoughtful in your responses."
            },
            {
              role: "user" as const,
              content: userMessage
            }
          ]
        });

        const assistantResponse = typeof response.choices[0]?.message?.content === 'string' 
          ? response.choices[0].message.content 
          : "I'm here to help with your spiritual journey.";

        // Save to database
        await saveAIChat(input.sessionId, ctx.user.id, userMessage, assistantResponse as string);

        return {
          userMessage,
          assistantResponse
        };
      }),
    clearMessages: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await clearSessionMessages(input.sessionId, ctx.user.id);
        return { success: true };
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
  dreams: router({
    submit: protectedProcedure
      .input(z.object({
        dreamContent: z.string().min(10, "Dream content must be at least 10 characters"),
        mood: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Create dream entry
        const dreamResult = await createDream(ctx.user.id, input.dreamContent, input.mood);
        const dreamId = Number((dreamResult as any).insertId || (dreamResult as any).lastInsertRowid);

        // Generate AI interpretation
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are a spiritual dream interpreter. Provide thoughtful, biblical interpretations of dreams with references to spiritual themes and biblical wisdom. Keep responses concise but meaningful.",
              },
              {
                role: "user",
                content: `Please interpret this dream from a spiritual perspective:\n\nDream: ${input.dreamContent}${input.mood ? `\nMood: ${input.mood}` : ""}`,
              },
            ],
          });

          const content = response.choices[0]?.message?.content;
          const interpretation = typeof content === 'string' ? content : "Unable to generate interpretation";
          if (dreamId) {
            await updateDreamInterpretation(dreamId, interpretation);
          }

          return { dreamId: dreamId || 0, interpretation };
        } catch (error) {
          console.error("Failed to generate dream interpretation:", error);
          return { dreamId, interpretation: "Interpretation pending..." };
        }
      }),
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return getDreamsByUserId(ctx.user.id);
    }),
    save: protectedProcedure
      .input(z.object({
        dreamId: z.number(),
        isSaved: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        await saveDream(input.dreamId, input.isSaved);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({
        dreamId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await deleteDream(input.dreamId);
        return { success: true };
      }),
  }),
  bible: router({
    getBooks: publicProcedure.query(async () => {
      return getAllBibleBooks();
    }),
    getBook: publicProcedure
      .input(z.object({
        bookId: z.number(),
      }))
      .query(async ({ input }) => {
        return getBibleBook(input.bookId);
      }),
    getChapter: publicProcedure
      .input(z.object({
        bookId: z.number(),
        chapter: z.number(),
      }))
      .query(async ({ input }) => {
        return getBibleVerses(input.bookId, input.chapter);
      }),
    getBookmarks: protectedProcedure.query(async ({ ctx }) => {
      return getUserBibleBookmarks(ctx.user.id);
    }),
    bookmarkVerse: protectedProcedure
      .input(z.object({
        verseId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await bookmarkBibleVerse(ctx.user.id, input.verseId, input.notes);
        return { success: true };
      }),
    removeBookmark: protectedProcedure
      .input(z.object({
        verseId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await removeBookmarkBibleVerse(ctx.user.id, input.verseId);
        return { success: true };
      }),
    markChapterRead: protectedProcedure
      .input(z.object({
        bookId: z.number(),
        chapter: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await markChapterAsRead(ctx.user.id, input.bookId, input.chapter);
        return { success: true };
      }),
    getReadingProgress: protectedProcedure.query(async ({ ctx }) => {
      return getUserBibleReadingProgress(ctx.user.id);
    }),
  }),
  search: router({
    global: protectedProcedure
      .input(z.object({
        query: z.string().min(1, "Search query required"),
      }))
      .query(async ({ input, ctx }) => {
        return globalSearch(ctx.user.id, input.query);
      }),
  }),
});
export type AppRouter = typeof appRouter;
