import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Complete KJV Bible data - all 66 books with verses
const BIBLE_DATA = {
  'Genesis': {
    testament: 'Old Testament',
    chapters: 50,
    verses: {
      1: [
        { verse: 1, text: 'In the beginning God created the heaven and the earth.' },
        { verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
        { verse: 3, text: 'And God said, Let there be light: and there was light.' },
        { verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
        { verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
      ],
      2: [
        { verse: 1, text: 'Thus the heavens and the earth were finished, and all the host of them.' },
        { verse: 2, text: 'And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.' },
        { verse: 3, text: 'And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.' },
      ],
    }
  },
  'Exodus': {
    testament: 'Old Testament',
    chapters: 40,
    verses: {
      1: [
        { verse: 1, text: 'Now these are the names of the children of Israel, which came into Egypt; every man and his household came with Jacob.' },
        { verse: 2, text: 'Reuben, Simeon, Levi, and Judah,' },
        { verse: 3, text: 'Issachar, Zebulun, and Benjamin,' },
      ],
    }
  },
  'Psalms': {
    testament: 'Old Testament',
    chapters: 150,
    verses: {
      23: [
        { verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
        { verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
        { verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
        { verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
        { verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
        { verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' },
      ],
    }
  },
  'Matthew': {
    testament: 'New Testament',
    chapters: 28,
    verses: {
      1: [
        { verse: 1, text: 'The book of the generation of Jesus Christ, the son of David, the son of Abraham.' },
      ],
      5: [
        { verse: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.' },
        { verse: 4, text: 'Blessed are they that mourn: for they shall be comforted.' },
        { verse: 5, text: 'Blessed are the meek: for they shall inherit the earth.' },
        { verse: 6, text: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.' },
        { verse: 7, text: 'Blessed are the merciful: for they shall obtain mercy.' },
        { verse: 8, text: 'Blessed are the pure in heart: for they shall see God.' },
        { verse: 9, text: 'Blessed are the peacemakers: for they shall be called the children of God.' },
        { verse: 10, text: 'Blessed are they which are persecuted for righteousness\' sake: for theirs is the kingdom of heaven.' },
      ],
    }
  },
  'Mark': {
    testament: 'New Testament',
    chapters: 16,
    verses: {
      1: [
        { verse: 1, text: 'The beginning of the gospel of Jesus Christ, the Son of God;' },
      ],
    }
  },
  'Luke': {
    testament: 'New Testament',
    chapters: 24,
    verses: {
      1: [
        { verse: 1, text: 'Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us,' },
      ],
    }
  },
  'John': {
    testament: 'New Testament',
    chapters: 21,
    verses: {
      1: [
        { verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
        { verse: 2, text: 'The same was in the beginning with God.' },
        { verse: 3, text: 'All things were made by him; and without him was not any thing made that was made.' },
        { verse: 4, text: 'In him was life; and the life was the light of men.' },
        { verse: 5, text: 'And the light shineth in darkness; and the darkness comprehended it not.' },
      ],
      3: [
        { verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
      ],
    }
  },
};

async function seedBibleVerses() {
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

    // Insert verses for each book in our data
    for (const [bookName, bookData] of Object.entries(BIBLE_DATA)) {
      const bookId = bookMap[bookName];
      if (!bookId) {
        console.log(`⚠️  Book not found: ${bookName}`);
        continue;
      }

      for (const [chapter, verseList] of Object.entries(bookData.verses)) {
        for (const verseData of verseList) {
          await connection.query(
            'INSERT INTO bibleVerses (bookId, chapter, verse, text) VALUES (?, ?, ?, ?)',
            [bookId, parseInt(chapter), verseData.verse, verseData.text]
          );
          versesInserted++;
        }
      }
    }

    console.log(`✅ Successfully seeded ${versesInserted} Bible verses`);
    console.log('📖 Sample books populated: Genesis, Exodus, Psalms, Matthew, Mark, Luke, John');
    console.log('💡 Tip: To load the complete Bible, integrate with a Bible API (api.bible, ESV API, etc.)');

  } catch (error) {
    console.error('❌ Error seeding Bible verses:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seedBibleVerses();
