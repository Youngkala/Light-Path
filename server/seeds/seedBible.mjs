import mysql from "mysql2/promise";

const BIBLE_BOOKS = [
  // Old Testament - 39 books
  [1, "Genesis", "Old Testament", "Gen", 50],
  [2, "Exodus", "Old Testament", "Exo", 40],
  [3, "Leviticus", "Old Testament", "Lev", 27],
  [4, "Numbers", "Old Testament", "Num", 36],
  [5, "Deuteronomy", "Old Testament", "Deu", 34],
  [6, "Joshua", "Old Testament", "Jos", 24],
  [7, "Judges", "Old Testament", "Jdg", 21],
  [8, "Ruth", "Old Testament", "Rut", 4],
  [9, "1 Samuel", "Old Testament", "1Sa", 31],
  [10, "2 Samuel", "Old Testament", "2Sa", 24],
  [11, "1 Kings", "Old Testament", "1Ki", 22],
  [12, "2 Kings", "Old Testament", "2Ki", 25],
  [13, "1 Chronicles", "Old Testament", "1Ch", 29],
  [14, "2 Chronicles", "Old Testament", "2Ch", 36],
  [15, "Ezra", "Old Testament", "Ezr", 10],
  [16, "Nehemiah", "Old Testament", "Neh", 13],
  [17, "Esther", "Old Testament", "Est", 10],
  [18, "Job", "Old Testament", "Job", 42],
  [19, "Psalms", "Old Testament", "Psa", 150],
  [20, "Proverbs", "Old Testament", "Pro", 31],
  [21, "Ecclesiastes", "Old Testament", "Ecc", 12],
  [22, "Song of Solomon", "Old Testament", "Son", 8],
  [23, "Isaiah", "Old Testament", "Isa", 66],
  [24, "Jeremiah", "Old Testament", "Jer", 52],
  [25, "Lamentations", "Old Testament", "Lam", 5],
  [26, "Ezekiel", "Old Testament", "Eze", 48],
  [27, "Daniel", "Old Testament", "Dan", 12],
  [28, "Hosea", "Old Testament", "Hos", 14],
  [29, "Joel", "Old Testament", "Joe", 3],
  [30, "Amos", "Old Testament", "Amo", 9],
  [31, "Obadiah", "Old Testament", "Oba", 1],
  [32, "Jonah", "Old Testament", "Jon", 4],
  [33, "Micah", "Old Testament", "Mic", 7],
  [34, "Nahum", "Old Testament", "Nah", 3],
  [35, "Habakkuk", "Old Testament", "Hab", 3],
  [36, "Zephaniah", "Old Testament", "Zep", 3],
  [37, "Haggai", "Old Testament", "Hag", 2],
  [38, "Zechariah", "Old Testament", "Zec", 14],
  [39, "Malachi", "Old Testament", "Mal", 4],
  
  // New Testament - 27 books
  [40, "Matthew", "New Testament", "Mat", 28],
  [41, "Mark", "New Testament", "Mar", 16],
  [42, "Luke", "New Testament", "Luk", 24],
  [43, "John", "New Testament", "Joh", 21],
  [44, "Acts", "New Testament", "Act", 28],
  [45, "Romans", "New Testament", "Rom", 16],
  [46, "1 Corinthians", "New Testament", "1Co", 16],
  [47, "2 Corinthians", "New Testament", "2Co", 13],
  [48, "Galatians", "New Testament", "Gal", 6],
  [49, "Ephesians", "New Testament", "Eph", 6],
  [50, "Philippians", "New Testament", "Phi", 4],
  [51, "Colossians", "New Testament", "Col", 4],
  [52, "1 Thessalonians", "New Testament", "1Th", 5],
  [53, "2 Thessalonians", "New Testament", "2Th", 3],
  [54, "1 Timothy", "New Testament", "1Ti", 6],
  [55, "2 Timothy", "New Testament", "2Ti", 4],
  [56, "Titus", "New Testament", "Tit", 3],
  [57, "Philemon", "New Testament", "Phm", 1],
  [58, "Hebrews", "New Testament", "Heb", 13],
  [59, "James", "New Testament", "Jas", 5],
  [60, "1 Peter", "New Testament", "1Pe", 5],
  [61, "2 Peter", "New Testament", "2Pe", 3],
  [62, "1 John", "New Testament", "1Jo", 5],
  [63, "2 John", "New Testament", "2Jo", 1],
  [64, "3 John", "New Testament", "3Jo", 1],
  [65, "Jude", "New Testament", "Jud", 1],
  [66, "Revelation", "New Testament", "Rev", 22],
];

const seedBible = async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable not set");
  }

  const connection = await mysql.createConnection(dbUrl);

  try {
    console.log("🔄 Checking if Bible books already exist...");
    const [rows] = await connection.execute("SELECT COUNT(*) as count FROM bibleBooks");
    const count = rows[0].count;

    if (count > 0) {
      console.log(`✅ Bible books already seeded (${count} books found). Skipping...`);
      return;
    }

    console.log("📖 Seeding Bible books...");
    const query = `
      INSERT INTO bibleBooks (bookNumber, bookName, testament, abbreviation, chapterCount)
      VALUES ?
    `;

    await connection.query(query, [BIBLE_BOOKS]);
    console.log(`✅ Successfully seeded ${BIBLE_BOOKS.length} Bible books!`);
  } catch (error) {
    console.error("❌ Error seeding Bible books:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

seedBible().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
