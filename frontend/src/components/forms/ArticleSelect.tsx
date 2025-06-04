import { useState } from 'react';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
}

interface ArticleSelectProps {
  articles: Article[];
  onSelect: (articleId: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function ArticleSelect({ 
  articles, 
  onSelect,
  isLoading,
  error
}: ArticleSelectProps) {
  const [search, setSearch] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');

  // Filter articles based on search term
  const filteredArticles = search
    ? articles.filter(article => 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.authors.toLowerCase().includes(search.toLowerCase()) ||
        article.journal.toLowerCase().includes(search.toLowerCase()) ||
        article.year.toString().includes(search)
      )
    : articles;

  const handleSelect = (articleId: string) => {
    setSelectedArticleId(articleId);
    onSelect(articleId);
  };

  if (isLoading) {
    return <p>Loading approved articles...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded">
        <p className="text-gray-500">No approved articles available. Please submit articles for moderation first.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles by title, author, journal..."
          className="w-full border border-gray-300 rounded-md py-2 px-3"
        />
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded">
        {filteredArticles.map(article => (
          <div
            key={article._id}
            className={`p-3 cursor-pointer ${
              selectedArticleId === article._id
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-gray-100 border-l-4 border-transparent'
            }`}
            onClick={() => handleSelect(article._id)}
          >
            <h3 className="font-semibold">{article.title}</h3>
            <p className="text-sm text-gray-600">{article.authors}, {article.journal}, {article.year}</p>
          </div>
        ))}
        
        {filteredArticles.length === 0 && (
          <div className="p-3 text-center text-gray-500">
            No articles match your search
          </div>
        )}
      </div>
    </div>
  );
}