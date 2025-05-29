// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouter } from 'next/navigation';

interface Evidence {
  _id: string;
  claim: string;
  result: 'agree' | 'disagree' | 'mixed';
  practiceName?: string;
  typeOfResearch?: string;
  article?: {
    title: string;
    year?: number;
  };
}

interface EvidenceCardsProps {
  evidence: Evidence[];
  onCardClick: (id: string) => void;
}

export default function EvidenceCards({ evidence, onCardClick }: EvidenceCardsProps) {
  // Function to format the result for display
  const getResultClass = (result: string) => {
    switch (result) {
      case 'agree':
        return 'text-green-600';
      case 'disagree':
        return 'text-red-600';
      case 'mixed':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'agree':
        return 'Supports';
      case 'disagree':
        return 'Contradicts';
      case 'mixed':
        return 'Mixed';
      default:
        return result;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {evidence.map((item) => (
        <div 
          key={item._id}
          className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
          onClick={() => onCardClick(item._id)}
        >
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.claim}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-medium ${getResultClass(item.result)}`}>
              {getResultText(item.result)}
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
              {item.typeOfResearch || 'Research'}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Practice:</span> {item.practiceName || 'Unknown'}
          </div>
          
          {item.article && (
            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              <div className="line-clamp-1">
                {item.article.title}
              </div>
              {item.article.year && (
                <div>Published: {item.article.year}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}