import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bookmark, BookOpen, ChevronLeft, ChevronRight, Search } from "lucide-react";

type ViewMode = "books" | "chapters" | "verses";

export function HolyBible() {
  const [viewMode, setViewMode] = useState<ViewMode>("books");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  // Fetch all Bible books
  const booksQuery = trpc.bible.getBooks.useQuery();
  const books = booksQuery.data || [];

  // Fetch verses for selected chapter
  const versesQuery = trpc.bible.getChapter.useQuery(
    {
      bookId: selectedBook?.id || 0,
      chapter: selectedChapter,
    },
    { enabled: !!selectedBook && viewMode === "verses" }
  );
  const verses = versesQuery.data || [];

  // Fetch user's bookmarks
  const bookmarksQuery = trpc.bible.getBookmarks.useQuery();
  const userBookmarks = bookmarksQuery.data || [];

  // Initialize bookmarks from user data
  useMemo(() => {
    const bookmarkIds = new Set(userBookmarks.map((b: any) => b.verseId));
    setBookmarks(bookmarkIds);
  }, [userBookmarks]);

  const isVerseBookmarked = (verseId: number) => bookmarks.has(verseId);

  // Filter books by search
  const filteredBooks = useMemo(() => {
    if (!searchQuery) return books;
    return books.filter((book: any) =>
      book.bookName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [books, searchQuery]);

  const handleBookSelect = (book: any) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setViewMode("chapters");
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setViewMode("verses");
  };

  const handleBookmarkVerse = async (verseId: number) => {
    if (bookmarks.has(verseId)) {
      await trpc.bible.removeBookmark.useMutation().mutateAsync({ verseId });
      setBookmarks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(verseId);
        return newSet;
      });
    } else {
      await trpc.bible.bookmarkVerse.useMutation().mutateAsync({ verseId });
      setBookmarks((prev) => {
        const newSet = new Set(prev);
        newSet.add(verseId);
        return newSet;
      });
    }
  };

  const handleMarkChapterRead = async () => {
    if (selectedBook) {
      await trpc.bible.markChapterRead.useMutation().mutateAsync({
        bookId: selectedBook.id,
        chapter: selectedChapter,
      });
    }
  };

  const handleBack = () => {
    if (viewMode === "verses") {
      setViewMode("chapters");
    } else if (viewMode === "chapters") {
      setViewMode("books");
      setSelectedBook(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-6">
          {(viewMode === "chapters" || viewMode === "verses") && (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="text-indigo-400 hover:text-indigo-300"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-3xl font-bold text-center flex-1">📖 Holy Bible</h1>
          <div className="w-10" />
        </div>

        {/* Search Bar - Only show in books view */}
        {viewMode === "books" && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-indigo-400" />
            <Input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        )}
      </div>

      {/* Books View */}
      {viewMode === "books" && (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Old Testament */}
            <div>
              <h2 className="text-xl font-bold text-indigo-300 mb-4">Old Testament</h2>
              <div className="space-y-2">
                {filteredBooks
                  .filter((book: any) => book.testament === "Old Testament")
                  .map((book: any) => (
                    <Button
                      key={book.id}
                      onClick={() => handleBookSelect(book)}
                      variant="outline"
                      className="w-full justify-start text-left bg-slate-700 border-slate-600 hover:bg-indigo-600 hover:border-indigo-500 text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span className="flex-1">{book.bookName}</span>
                      <span className="text-xs text-slate-400">{book.chapterCount} ch</span>
                    </Button>
                  ))}
              </div>
            </div>

            {/* New Testament */}
            <div>
              <h2 className="text-xl font-bold text-indigo-300 mb-4">New Testament</h2>
              <div className="space-y-2">
                {filteredBooks
                  .filter((book: any) => book.testament === "New Testament")
                  .map((book: any) => (
                    <Button
                      key={book.id}
                      onClick={() => handleBookSelect(book)}
                      variant="outline"
                      className="w-full justify-start text-left bg-slate-700 border-slate-600 hover:bg-indigo-600 hover:border-indigo-500 text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span className="flex-1">{book.bookName}</span>
                      <span className="text-xs text-slate-400">{book.chapterCount} ch</span>
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters View */}
      {viewMode === "chapters" && selectedBook && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-indigo-300">{selectedBook.bookName}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {Array.from({ length: selectedBook.chapterCount }, (_, i) => i + 1).map((chapter) => (
              <Button
                key={chapter}
                onClick={() => handleChapterSelect(chapter)}
                variant={selectedChapter === chapter ? "default" : "outline"}
                className={`${
                  selectedChapter === chapter
                    ? "bg-indigo-600 border-indigo-500"
                    : "bg-slate-700 border-slate-600 hover:bg-indigo-600"
                } text-white`}
              >
                {chapter}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Verses View */}
      {viewMode === "verses" && selectedBook && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-indigo-300 mb-2">
              {selectedBook.bookName} {selectedChapter}
            </h2>
            <Button
              onClick={handleMarkChapterRead}
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-green-600 text-white"
            >
              ✓ Mark as Read
            </Button>
          </div>

          <div className="space-y-4">
            {versesQuery.isLoading ? (
              <div className="text-center text-slate-400">Loading verses...</div>
            ) : verses.length === 0 ? (
              <div className="text-center text-slate-400">No verses found</div>
            ) : (
              verses.map((verse: any) => (
                <Card
                  key={verse.id}
                  className="bg-slate-700 border-slate-600 p-4 hover:bg-slate-650 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-indigo-400 font-bold text-sm flex-shrink-0">
                          {verse.verse}
                        </span>
                        <p className="text-white leading-relaxed flex-1">{verse.text}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBookmarkVerse(verse.id)}
                      variant="ghost"
                      size="sm"
                      className={isVerseBookmarked(verse.id) ? "text-yellow-400" : "text-slate-400"}
                    >
                      <Bookmark
                        className="w-5 h-5"
                        fill={isVerseBookmarked(verse.id) ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-4">
            <Button
              onClick={() => {
                if (selectedChapter > 1) {
                  handleChapterSelect(selectedChapter - 1);
                }
              }}
              disabled={selectedChapter === 1}
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-indigo-600 text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => {
                if (selectedChapter < selectedBook.chapterCount) {
                  handleChapterSelect(selectedChapter + 1);
                }
              }}
              disabled={selectedChapter >= selectedBook.chapterCount}
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-indigo-600 text-white disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
