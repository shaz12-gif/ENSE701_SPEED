/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * EvidenceCards component
 * Displays a grid of evidence cards for quick browsing.
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 */

import { useRouter } from 'next/navigation';

interface Evidence {
  _id: string;
  claim: string;
  result: 'agree' | 'disagree' | 'mixed';
  typeOfResearch: string;
  participantType: string;
  practiceName?: string;
  title?: string;
  year?: number;
  article?: {
    title?: string;
    year?: number;
    authors?: string;
  };
  averageRating?: number;
  [key: string]: any;
}

interface EvidenceCardsProps {
  evidence: Evidence[];
  onCardClick: (id: string) => void;
}

export default function EvidenceCards({ evidence, onCardClick }: EvidenceCardsProps) {
  // Format result for display
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

  // Format rating as stars
  const formatRating = (rating?: number) => {
    if (!rating) return null;
    return `★`.repeat(Math.round(rating)) + `☆`.repeat(5 - Math.round(rating));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {evidence.map(item => (
        <div 
          key={item._id}
          onClick={() => onCardClick(item._id)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.claim}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {item.article?.title || item.title || "Untitled Article"} 
              ({item.article?.year || item.year || "N/A"})
            </p>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Research: {item.typeOfResearch || 'N/A'}</span>
                <span>Participants: {item.participantType || 'N/A'}</span>
              </div>
              
              {item.practiceName && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {item.practiceName}
                </div>
              )}
              
              {item.averageRating && (
                <div className="text-yellow-500 text-sm">
                  {formatRating(item.averageRating)}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${item.result === 'agree' ? 'bg-green-100 text-green-800' : 
                    item.result === 'disagree' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}
              >
                {getResultText(item.result)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}