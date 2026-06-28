# LightPath - Christian Spiritual Growth App

> A comprehensive mobile-first web application designed to support Christian spiritual growth through prayer, Bible study, habit tracking, and AI-powered spiritual guidance.

**Live Demo:** [https://lightpathapp-zbfyvxk9.manus.space](https://lightpathapp-zbfyvxk9.manus.space)

---

## 🌟 Overview

LightPath is a modern spiritual companion app that helps Christians deepen their faith through structured prayer journaling, daily Bible reading, habit tracking, and personalized spiritual mentorship. Built with cutting-edge web technologies, it provides a seamless experience across all devices.

### Key Features

- **🙏 Prayer Journal** - Record, track, and reflect on your prayers with category organization and answered prayer tracking
- **📖 Holy Bible** - Complete King James Version Bible with 31,000+ verses, bookmarks, and reading progress tracking
- **💭 Dreams Interpreter** - AI-powered spiritual dream interpretation with mood tracking and saved interpretations
- **🧠 Spiritual Mentor** - AI chat companion providing biblical guidance and spiritual advice
- **📚 Devotionals** - Curated daily devotional content with bookmarking and sharing capabilities
- **⚡ Habit Tracker** - Build spiritual disciplines with streak tracking and daily completion logging
- **🔍 Global Search** - Instantly search across all prayers, Bible verses, and devotionals
- **📊 Dashboard** - Personalized dashboard with daily verse, prayer stats, and quick access to all features
- **🔐 Secure Authentication** - Email/password and OAuth login with session management

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm package manager
- MySQL/TiDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Youngkala/Light-Path.git
   cd Light-Path
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/lightpath
   JWT_SECRET=your_jwt_secret_key
   VITE_APP_ID=your_oauth_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   ```

4. **Run database migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Seed Bible data** (Optional - for full Bible content)
   ```bash
   node server/seeds/seedCompleteBible.mjs
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
lightpath/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components (Dashboard, Search, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # tRPC client and utilities
│   │   ├── hooks/            # Custom React hooks
│   │   ├── contexts/         # React contexts
│   │   └── index.css         # Global styles (Tailwind)
│   └── public/               # Static assets
├── server/                    # Express backend
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database queries and helpers
│   ├── _core/                # Core infrastructure
│   │   ├── auth/             # Authentication logic
│   │   ├── llm.ts            # LLM integration
│   │   ├── trpc.ts           # tRPC setup
│   │   └── ...
│   └── seeds/                # Database seed scripts
├── drizzle/                  # Database schema and migrations
│   ├── schema.ts             # Table definitions
│   └── migrations/           # Generated SQL migrations
├── shared/                   # Shared types and constants
└── storage/                  # S3 file storage helpers
```

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Component library
- **tRPC** - End-to-end type-safe APIs
- **Wouter** - Lightweight routing
- **Vite** - Build tool

### Backend
- **Express.js** - Web server
- **tRPC** - RPC framework
- **Drizzle ORM** - Type-safe database access
- **MySQL/TiDB** - Database
- **Zod** - Schema validation

### AI & Services
- **LLM Integration** - AI-powered dream interpretation and mentorship
- **OAuth 2.0** - Secure authentication
- **S3 Storage** - File storage

---

## 📚 Core Features Explained

### Prayer Journal
Track your spiritual conversations with God. Each prayer can be categorized, marked as answered, and reflected upon over time.

### Holy Bible
Access the complete King James Version Bible with:
- Book browsing (66 books organized by Old/New Testament)
- Chapter navigation with verse reading
- Verse bookmarking for quick reference
- Reading progress tracking
- Full-text search across all verses

### Dreams Interpreter
Explore the spiritual meaning of your dreams using AI:
- Record dream content and mood
- Get AI-powered biblical interpretation
- Save favorite interpretations
- Track dream patterns over time

### Spiritual Mentor
Chat with an AI spiritual guide that:
- Provides biblical advice and guidance
- Answers spiritual questions
- Offers encouragement and wisdom
- Maintains conversation history

### Global Search
Instantly search across:
- Your prayer journal entries
- All Bible verses (31,000+)
- Devotional content
- Results organized by category with direct navigation

---

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

View test coverage:
```bash
pnpm test:coverage
```

---

## 🔐 Authentication

LightPath supports two authentication methods:

### Email/Password
- Sign up with email and password
- Secure password hashing with bcrypt
- Password reset via email token

### OAuth 2.0
- Login with Manus OAuth provider
- Seamless session management
- Automatic user profile creation

---

## 📱 Responsive Design

LightPath is fully responsive and optimized for:
- 📱 Mobile phones (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop (1024px and up)

The app uses a mobile-first approach with bottom navigation for easy thumb access on phones.

---

## 🎨 Design System

### Color Palette
- **Primary**: Deep blue (#1e40af)
- **Accent**: Warm orange (#ea580c)
- **Background**: Dark navy (#0f172a)
- **Foreground**: Light gray (#f1f5f9)

### Typography
- **Headings**: Serif font for elegance
- **Body**: Sans-serif for readability
- **Code**: Monospace for technical content

---

## 🚀 Deployment

### Deploy to Production

The app is configured for serverless deployment on Cloud Run with:
- Autoscaling (0 to N instances)
- 512MB RAM per instance
- 180s request timeout
- Automatic HTTPS

To deploy:
```bash
pnpm build
# Push to your deployment platform
```

### Custom Domain

Update your domain settings in the Manus dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure MySQL/TiDB server is running
- Check network connectivity

### Search Not Working
- Ensure Bible verses are seeded: `node server/seeds/seedCompleteBible.mjs`
- Check database has content: `SELECT COUNT(*) FROM bibleVerses;`

### Authentication Failures
- Verify OAuth credentials in environment variables
- Check session cookie settings
- Clear browser cookies and try again

### LLM Integration Issues
- Verify `BUILT_IN_FORGE_API_KEY` is set
- Check API endpoint in `BUILT_IN_FORGE_API_URL`
- Review LLM response in browser console

---

## 📖 API Documentation

### tRPC Procedures

#### Prayer Journal
- `prayers.list` - Get user's prayers
- `prayers.create` - Create new prayer
- `prayers.update` - Update prayer
- `prayers.delete` - Delete prayer

#### Bible
- `bible.getBooks` - List all books
- `bible.getChapter` - Get verses for chapter
- `bible.bookmarkVerse` - Bookmark a verse
- `bible.getBookmarks` - Get user's bookmarks

#### Search
- `search.global` - Search across all content

#### Dreams
- `dreams.submit` - Submit dream for interpretation
- `dreams.getHistory` - Get dream history
- `dreams.save` - Save dream interpretation

#### Mentor
- `mentor.chat` - Send message to AI mentor
- `mentor.history` - Get chat history

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write tests for new features
- Update README for significant changes
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **King James Bible** - Public domain Bible translation
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **tRPC** - Type-safe RPC framework
- **Drizzle ORM** - Modern database toolkit

---

## 📞 Support

For issues, questions, or suggestions:

1. **GitHub Issues** - Report bugs and request features
2. **Email** - Contact the development team
3. **Documentation** - Check the docs folder for detailed guides

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Verse commentary and cross-references
- [ ] Bible reading plans (90-day, yearly, etc.)
- [ ] Community prayer groups
- [ ] Verse sharing and social features
- [ ] Offline Bible reading
- [ ] Audio Bible narration
- [ ] Prayer reminders and notifications
- [ ] Advanced analytics and insights
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support

---

## 📊 Project Statistics

- **Total Features**: 8 major features
- **Database Tables**: 15+ tables
- **API Endpoints**: 40+ tRPC procedures
- **Bible Content**: 31,000+ verses (KJV)
- **Test Coverage**: 48+ unit tests
- **Code Lines**: 5,000+ lines of production code

---

## 🎯 Vision

LightPath aims to be the go-to spiritual companion app for Christians seeking to:
- Deepen their prayer life
- Study Scripture consistently
- Build spiritual disciplines
- Find guidance and encouragement
- Connect with their faith community

We believe technology should serve faith, not replace it. LightPath is designed to be a tool that brings people closer to God and to each other.

---

**Made with ❤️ for spiritual growth**

---

*Last Updated: June 2026*
*Version: 1.0.0*
