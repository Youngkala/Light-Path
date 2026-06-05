import mysql from 'mysql2/promise';
import https from 'https';

const DATABASE_URL = process.env.DATABASE_URL;

// Map GitHub book names to database book names
const BOOK_NAME_MAP = {
  'Genesis': 'Genesis',
  'Exodus': 'Exodus',
  'Leviticus': 'Leviticus',
  'Numbers': 'Numbers',
  'Deuteronomy': 'Deuteronomy',
  'Joshua': 'Joshua',
  'Judges': 'Judges',
  'Ruth': 'Ruth',
  '1Samuel': '1 Samuel',
  '2Samuel': '2 Samuel',
  '1Kings': '1 Kings',
  '2Kings': '2 Kings',
  '1Chronicles': '1 Chronicles',
  '2Chronicles': '2 Chronicles',
  'Ezra': 'Ezra',
  'Nehemiah': 'Nehemiah',
  'Esther': 'Esther',
  'Job': 'Job',
  'Psalms': 'Psalms',
  'Proverbs': 'Proverbs',
  'Ecclesiastes': 'Ecclesiastes',
  'SongOfSolomon': 'Song of Solomon',
  'Isaiah': 'Isaiah',
  'Jeremiah': 'Jeremiah',
  'Lamentations': 'Lamentations',
  'Ezekiel': 'Ezekiel',
  'Daniel': 'Daniel',
  'Hosea': 'Hosea',
  'Joel': 'Joel',
  'Amos': 'Amos',
  'Obadiah': 'Obadiah',
  'Jonah': 'Jonah',
  'Micah': 'Micah',
  'Nahum': 'Nahum',
  'Habakkuk': 'Habakkuk',
  'Zephaniah': 'Zephaniah',
  'Haggai': 'Haggai',
  'Zechariah': 'Zechariah',
  'Malachi': 'Malachi',
  'Matthew': 'Matthew',
  'Mark': 'Mark',
  'Luke': 'Luke',
  'John': 'John',
  'Acts': 'Acts',
  'Romans': 'Romans',
  '1Corinthians': '1 Corinthians',
  '2Corinthians': '2 Corinthians',
  'Galatians': 'Galatians',
  'Ephesians': 'Ephesians',
  'Philippians': 'Philippians',
  'Colossians': 'Colossians',
  '1Thessalonians': '1 Thessalonians',
  '2Thessalonians': '2 Thessalonians',
  '1Timothy': '1 Timothy',
  '2Timothy': '2 Timothy',
  'Titus': 'Titus',
  'Philemon': 'Philemon',
  'Hebrews': 'Hebrews',
  'James': 'James',
  '1Peter': '1 Peter',
  '2Peter': '2 Peter',
  '1John': '1 John',
  '2John': '2 John',
  '3John': '3 John',
  'Jude': 'Jude',
  'Revelation': 'Revelation'
};

// Books in order (GitHub names)
const BIBLE_BOOKS_GITHUB = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1Samuel', '2Samuel', '1Kings', '2Kings', '1Chronicles', '2Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1Corinthians', '2Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians', '1Thessalonians', '2Thessalonians', '1Timothy', '2Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1Peter', '2Peter', '1John', '2John', '3John', 'Jude',
  'Revelation'
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function seedCompleteBible() {
  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL);

    // Get all books from database
    const [books] = await connection.query('SELECT id, bookName FROM bibleBooks');
    const bookMap = {};
    books.forEach(book => {
      bookMap[book.bookName] = book.id;
    });

    let versesInserted = 0;
    let booksProcessed = 0;

    console.log('📥 Fetching KJV Bible verses from GitHub...');
    console.log(`📖 Processing ${BIBLE_BOOKS_GITHUB.length} books...\n`);

    for (const githubBookName of BIBLE_BOOKS_GITHUB) {
      try {
        const url = `https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${githubBookName}.json`;
        const response = await fetchJSON(url);
        
        const dbBookName = BOOK_NAME_MAP[githubBookName];
        const bookId = bookMap[dbBookName];

        if (!bookId) {
          console.log(`⚠️  Book not found in database: ${dbBookName}`);
          continue;
        }

        // Response structure: { chapters: [ { chapter: "1", verses: [...] }, ... ] }
        if (response && response.chapters && Array.isArray(response.chapters)) {
          for (const chapterData of response.chapters) {
            const chapter = parseInt(chapterData.chapter);
            const verses = chapterData.verses || [];
            
            for (const verseData of verses) {
              if (verseData && verseData.verse && verseData.text) {
                await connection.query(
                  'INSERT INTO bibleVerses (bookId, chapter, verse, text) VALUES (?, ?, ?, ?)',
                  [bookId, chapter, parseInt(verseData.verse), verseData.text]
                );
                versesInserted++;
              }
            }
          }
        }

        booksProcessed++;
        process.stdout.write(`✅ ${githubBookName.padEnd(20)} - ${versesInserted} verses total\n`);

      } catch (error) {
        console.error(`❌ Error processing ${githubBookName}: ${error.message}`);
      }
    }

    console.log(`\n✅ Successfully seeded ${versesInserted} Bible verses from ${booksProcessed} books!`);
    console.log('📖 Complete KJV Bible is now available in the database');

  } catch (error) {
    console.error('❌ Error seeding Bible:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seedCompleteBible();
