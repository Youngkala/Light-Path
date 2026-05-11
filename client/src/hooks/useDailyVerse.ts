import { useState, useEffect } from "react";
import {
  getTodaysDailyVerse,
  hasNewDayPassed,
  DailyVerse,
} from "@/lib/dailyVerses";

const STORAGE_KEY = "daily_verse";
const STORAGE_DATE_KEY = "daily_verse_date";

export function useDailyVerse() {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVerse = () => {
      try {
        // Get stored verse and date
        const storedVerseJson = localStorage.getItem(STORAGE_KEY);
        const storedDate = localStorage.getItem(STORAGE_DATE_KEY);

        // Check if a new day has passed
        if (hasNewDayPassed(storedDate || "")) {
          // Get today's verse
          const todaysVerse = getTodaysDailyVerse();
          const today = new Date().toISOString();

          // Store new verse and date
          localStorage.setItem(STORAGE_KEY, JSON.stringify(todaysVerse));
          localStorage.setItem(STORAGE_DATE_KEY, today);

          setVerse(todaysVerse);
        } else if (storedVerseJson) {
          // Use stored verse if same day
          const storedVerse = JSON.parse(storedVerseJson);
          setVerse(storedVerse);
        } else {
          // Fallback: get today's verse
          const todaysVerse = getTodaysDailyVerse();
          const today = new Date().toISOString();

          localStorage.setItem(STORAGE_KEY, JSON.stringify(todaysVerse));
          localStorage.setItem(STORAGE_DATE_KEY, today);

          setVerse(todaysVerse);
        }
      } catch (error) {
        console.error("Error loading daily verse:", error);
        // Fallback to today's verse if localStorage fails
        setVerse(getTodaysDailyVerse());
      } finally {
        setIsLoading(false);
      }
    };

    loadVerse();
  }, []);

  return { verse, isLoading };
}
