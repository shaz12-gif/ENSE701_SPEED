interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  submittedBy?: string;
  createdAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface ArticleCardProps {
  article: Article;
  actions?: Array<{
    label: string;
    onClick: () => void;
    className?: string;
  }>;
}

export default function ArticleCard({ article, actions }: ArticleCardProps) {
  // Format the creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{article.authors}</p>
      <p className="text-sm mb-4">
        {article.journal}, {article.year}
        {article.volume && `, Volume ${article.volume}`}
        {article.number && `, Issue ${article.number}`}
        {article.pages && `, Pages ${article.pages}`}
      </p>
      {article.doi && (
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">DOI:</span> {article.doi}
        </p>
      )}
      <div className="text-xs text-gray-500 mt-2">
        <p>Submitted by: {article.submittedBy || 'Anonymous'}</p>
        <p>Date: {formatDate(article.createdAt)}</p>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex space-x-2 mt-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-4 py-2 text-white rounded text-sm ${action.className || 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}