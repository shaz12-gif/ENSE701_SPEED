/**
 * ArticleCard component
 * Displays article information in a card format with optional action buttons.
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 */

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
}

interface ActionButton {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

interface ArticleCardProps {
  article: Article;
  actions?: ActionButton[];
}

export default function ArticleCard({ article, actions }: ArticleCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{article.authors}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-500">Journal: </span>
          <span className="font-medium">{article.journal || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500">Year: </span>
          <span className="font-medium">{article.year}</span>
        </div>
        {article.doi && (
          <div className="col-span-2">
            <span className="text-gray-500">DOI: </span>
            <a
              href={article.doi.startsWith('http') ? article.doi : `https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {article.doi}
            </a>
          </div>
        )}
      </div>
      
      {actions && actions.length > 0 && (
        <div className="flex justify-end space-x-2 mt-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`px-3 py-1 text-white rounded ${
                action.className || 'bg-blue-500 hover:bg-blue-600'
              } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}