import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X, BookOpen, Heart, Book } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Search() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMutation = trpc.search.global.useQuery(
    { query },
    { enabled: false }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    try {
      const results = await searchMutation.refetch();
      if (results.data) {
        setSearchResults(results.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSearchResults(null);
    setHasSearched(false);
  };

  const totalResults =
    (searchResults?.prayers?.length || 0) +
    (searchResults?.bibleVerses?.length || 0) +
    (searchResults?.devotionals?.length || 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Search</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
              <Input
                type="text"
                placeholder="Search prayers, Bible verses, devotionals..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              disabled={!query.trim()}
            >
              Search
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {!hasSearched ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">
              Start typing to search prayers, Bible verses, and devotionals
            </p>
          </div>
        ) : searchMutation.isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <SearchIcon className="w-8 h-8 text-accent" />
            </div>
            <p className="text-muted-foreground mt-4">Searching...</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No results found for "{query}"
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <p className="text-sm text-muted-foreground">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "
              {query}"
            </p>

            {/* Prayers Results */}
            {searchResults?.prayers && searchResults.prayers.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Prayers ({searchResults.prayers.length})
                </h2>
                <div className="space-y-2">
                  {searchResults.prayers.map((prayer: any) => (
                    <Card
                      key={prayer.id}
                      className="p-4 bg-card border-border hover:border-accent/50 transition-all cursor-pointer"
                      onClick={() => setLocation("/prayers")}
                    >
                      <p className="text-sm text-foreground line-clamp-2">
                        {prayer.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {prayer.category}
                        {prayer.isAnswered && " • Answered"}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Bible Verses Results */}
            {searchResults?.bibleVerses &&
              searchResults.bibleVerses.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Book className="w-5 h-5 text-amber-600" />
                    Bible Verses ({searchResults.bibleVerses.length})
                  </h2>
                  <div className="space-y-2">
                    {searchResults.bibleVerses.map((verse: any) => (
                      <Card
                        key={verse.id}
                        className="p-4 bg-card border-border hover:border-accent/50 transition-all cursor-pointer"
                        onClick={() => setLocation("/holy-bible")}
                      >
                        <p className="text-sm font-semibold text-accent">
                          {verse.bookName} {verse.chapter}:{verse.verse}
                        </p>
                        <p className="text-sm text-foreground line-clamp-2 mt-2">
                          {verse.text}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

            {/* Devotionals Results */}
            {searchResults?.devotionals &&
              searchResults.devotionals.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Devotionals ({searchResults.devotionals.length})
                  </h2>
                  <div className="space-y-2">
                    {searchResults.devotionals.map((devotional: any) => (
                      <Card
                        key={devotional.id}
                        className="p-4 bg-card border-border hover:border-accent/50 transition-all cursor-pointer"
                        onClick={() => setLocation("/devotionals")}
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {devotional.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {devotional.content}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}
