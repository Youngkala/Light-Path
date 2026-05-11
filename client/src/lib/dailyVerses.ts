/**
 * Daily Bible Verse Database
 * Contains 60+ verses for automatic daily rotation
 */

export interface DailyVerse {
  id: number;
  text: string;
  reference: string;
  category?: string;
}

export const dailyVerses: DailyVerse[] = [
  {
    id: 1,
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    category: "strength",
  },
  {
    id: 2,
    text: "For God has not given us a spirit of fear, but of power, love, and a sound mind.",
    reference: "2 Timothy 1:7",
    category: "courage",
  },
  {
    id: 3,
    text: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5",
    category: "faith",
  },
  {
    id: 4,
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28",
    category: "peace",
  },
  {
    id: 5,
    text: "For we walk by faith, not by sight.",
    reference: "2 Corinthians 5:7",
    category: "faith",
  },
  {
    id: 6,
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    category: "prayer",
  },
  {
    id: 7,
    text: "My grace is sufficient for you, for my power is made perfect in weakness.",
    reference: "2 Corinthians 12:9",
    category: "grace",
  },
  {
    id: 8,
    text: "The Lord is my shepherd, I shall not want.",
    reference: "Psalm 23:1",
    category: "comfort",
  },
  {
    id: 9,
    text: "For God so loved the world that he gave his one and only Son.",
    reference: "John 3:16",
    category: "love",
  },
  {
    id: 10,
    text: "Cast all your anxiety on him because he cares for you.",
    reference: "1 Peter 5:7",
    category: "peace",
  },
  {
    id: 11,
    text: "I have told you these things, so that in me you may have peace.",
    reference: "John 16:33",
    category: "peace",
  },
  {
    id: 12,
    text: "Rejoice in the Lord always. I will say it again: Rejoice!",
    reference: "Philippians 4:4",
    category: "joy",
  },
  {
    id: 13,
    text: "Love the Lord your God with all your heart and with all your soul and with all your mind.",
    reference: "Matthew 22:37",
    category: "love",
  },
  {
    id: 14,
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you.",
    reference: "Joshua 1:9",
    category: "courage",
  },
  {
    id: 15,
    text: "Commit to the Lord whatever you do, and your plans will succeed.",
    reference: "Proverbs 16:3",
    category: "guidance",
  },
  {
    id: 16,
    text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    reference: "Psalm 34:18",
    category: "comfort",
  },
  {
    id: 17,
    text: "I have set before you life and death, blessings and curses. Now choose life.",
    reference: "Deuteronomy 30:15",
    category: "choice",
  },
  {
    id: 18,
    text: "Blessed are those who hunger and thirst for righteousness, for they will be filled.",
    reference: "Matthew 5:6",
    category: "blessing",
  },
  {
    id: 19,
    text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself.",
    reference: "Matthew 6:34",
    category: "peace",
  },
  {
    id: 20,
    text: "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace.",
    reference: "Colossians 3:15",
    category: "peace",
  },
  {
    id: 21,
    text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
    reference: "2 Timothy 1:7",
    category: "strength",
  },
  {
    id: 22,
    text: "Seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    reference: "Matthew 6:33",
    category: "guidance",
  },
  {
    id: 23,
    text: "I am the light of the world. Whoever follows me will never walk in darkness.",
    reference: "John 8:12",
    category: "guidance",
  },
  {
    id: 24,
    text: "For we are God's handiwork, created in Christ Jesus to do good works.",
    reference: "Ephesians 2:10",
    category: "purpose",
  },
  {
    id: 25,
    text: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
    reference: "Philippians 4:19",
    category: "provision",
  },
  {
    id: 26,
    text: "Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion.",
    reference: "2 Corinthians 1:3",
    category: "praise",
  },
  {
    id: 27,
    text: "But Jesus looked at them and said, 'With man this is impossible, but with God all things are possible.'",
    reference: "Matthew 19:26",
    category: "faith",
  },
  {
    id: 28,
    text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus.",
    reference: "Romans 6:23",
    category: "salvation",
  },
  {
    id: 29,
    text: "Therefore, if anyone is in Christ, the new creation has come.",
    reference: "2 Corinthians 5:17",
    category: "transformation",
  },
  {
    id: 30,
    text: "I have fought the good fight, I have finished the race, I have kept the faith.",
    reference: "2 Timothy 4:7",
    category: "perseverance",
  },
  {
    id: 31,
    text: "Do to others what you would have them do to you.",
    reference: "Matthew 7:12",
    category: "kindness",
  },
  {
    id: 32,
    text: "Blessed is the one who trusts in the Lord, whose confidence is in him.",
    reference: "Jeremiah 17:7",
    category: "faith",
  },
  {
    id: 33,
    text: "Let us not become weary in doing good, for at the proper time we will reap a harvest.",
    reference: "Galatians 6:9",
    category: "perseverance",
  },
  {
    id: 34,
    text: "The Lord bless you and keep you; the Lord make his face to shine upon you.",
    reference: "Numbers 6:24-25",
    category: "blessing",
  },
  {
    id: 35,
    text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil.",
    reference: "Jeremiah 29:11",
    category: "hope",
  },
  {
    id: 36,
    text: "Delight yourself in the Lord, and he will give you the desires of your heart.",
    reference: "Psalm 37:4",
    category: "joy",
  },
  {
    id: 37,
    text: "Be merciful to those who doubt; save others by snatching them from the fire.",
    reference: "Jude 1:22-23",
    category: "mercy",
  },
  {
    id: 38,
    text: "Therefore each of you must put off falsehood and speak truthfully to your neighbor.",
    reference: "Ephesians 4:25",
    category: "integrity",
  },
  {
    id: 39,
    text: "You are the light of the world. A town built on a hill cannot be hidden.",
    reference: "Matthew 5:14",
    category: "purpose",
  },
  {
    id: 40,
    text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    reference: "Matthew 6:33",
    category: "guidance",
  },
  {
    id: 41,
    text: "I praise you because I am fearfully and wonderfully made.",
    reference: "Psalm 139:14",
    category: "worth",
  },
  {
    id: 42,
    text: "The fear of the Lord is the beginning of wisdom.",
    reference: "Proverbs 9:10",
    category: "wisdom",
  },
  {
    id: 43,
    text: "And we know that in all things God works for the good of those who love him.",
    reference: "Romans 8:28",
    category: "faith",
  },
  {
    id: 44,
    text: "Let your light shine before others, that they may see your good deeds.",
    reference: "Matthew 5:16",
    category: "witness",
  },
  {
    id: 45,
    text: "For God did not give us a spirit of timidity, but a spirit of power, of love and of self-discipline.",
    reference: "2 Timothy 1:7",
    category: "courage",
  },
  {
    id: 46,
    text: "Blessed are the pure in heart, for they will see God.",
    reference: "Matthew 5:8",
    category: "blessing",
  },
  {
    id: 47,
    text: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion.",
    reference: "Colossians 3:12",
    category: "character",
  },
  {
    id: 48,
    text: "The righteous cry out, and the Lord hears them; he delivers them from all their troubles.",
    reference: "Psalm 34:17",
    category: "deliverance",
  },
  {
    id: 49,
    text: "Humble yourselves, therefore, under God's mighty hand, that he may lift you up in due time.",
    reference: "1 Peter 5:6",
    category: "humility",
  },
  {
    id: 50,
    text: "Therefore, my dear friends, as you have always obeyed—continue to work out your salvation.",
    reference: "Philippians 2:12",
    category: "growth",
  },
  {
    id: 51,
    text: "Praise the Lord, my soul; all my inmost being, praise his holy name.",
    reference: "Psalm 103:1",
    category: "praise",
  },
  {
    id: 52,
    text: "Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up.",
    reference: "Ephesians 4:29",
    category: "speech",
  },
  {
    id: 53,
    text: "For the Lord your God is with you wherever you go.",
    reference: "Joshua 1:9",
    category: "presence",
  },
  {
    id: 54,
    text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness.",
    reference: "Galatians 5:22",
    category: "fruit",
  },
  {
    id: 55,
    text: "Therefore, put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground.",
    reference: "Ephesians 6:13",
    category: "strength",
  },
  {
    id: 56,
    text: "Now to him who is able to do immeasurably more than all we ask or imagine.",
    reference: "Ephesians 3:20",
    category: "power",
  },
  {
    id: 57,
    text: "Forgive as the Lord forgave you.",
    reference: "Colossians 3:13",
    category: "forgiveness",
  },
  {
    id: 58,
    text: "May the Lord answer you when you are in distress; may the name of the God of Jacob protect you.",
    reference: "Psalm 20:1",
    category: "protection",
  },
  {
    id: 59,
    text: "So whether you eat or drink or whatever you do, do it all for the glory of God.",
    reference: "1 Corinthians 10:31",
    category: "purpose",
  },
  {
    id: 60,
    text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds.",
    reference: "Philippians 4:7",
    category: "peace",
  },
];

/**
 * Get today's daily verse based on date
 * Uses modulo to cycle through verses
 */
export function getTodaysDailyVerse(): DailyVerse {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const verseIndex = dayOfYear % dailyVerses.length;
  return dailyVerses[verseIndex];
}

/**
 * Get verse for a specific date
 */
export function getVerseForDate(date: Date): DailyVerse {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const verseIndex = dayOfYear % dailyVerses.length;
  return dailyVerses[verseIndex];
}

/**
 * Check if a new day has passed
 */
export function hasNewDayPassed(lastDate: string): boolean {
  if (!lastDate) return true;
  const last = new Date(lastDate);
  const today = new Date();
  return (
    last.getFullYear() !== today.getFullYear() ||
    last.getMonth() !== today.getMonth() ||
    last.getDate() !== today.getDate()
  );
}
