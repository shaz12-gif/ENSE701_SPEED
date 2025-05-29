import { type SortableField } from '@/types'; // Import from central types file
// Or define it locally:
// type SortableField = 'claim' | 'result' | 'practice' | 'year' | 'typeOfResearch' | 'participantType';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Evidence {
  _id: string;
  claim: string;
  result: string;
  typeOfResearch: string;
  participantType: string;
  article?: {
    title: string;
    year: number;
  };
}

interface EvidenceTableProps {
  evidence: Evidence[];
  sortField: SortableField; // Use the specific type
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortableField) => void; // Use the specific type
  onRowClick: (id: string) => void;
}

export default function EvidenceTable({ 
  evidence, 
  sortField, 
  sortDirection, 
  onSort,
  onRowClick
}: EvidenceTableProps) {
  // Helper to render the sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };
  
  // Format the result for display
  const formatResult = (result: string) => {
    switch (result) {
      case 'agree':
        return <span className="text-green-600 font-medium">Supports</span>;
      case 'disagree':
        return <span className="text-red-600 font-medium">Contradicts</span>;
      case 'mixed':
        return <span className="text-yellow-600 font-medium">Mixed</span>;
      default:
        return result || 'N/A';
    }
  };

  if (evidence.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded">
        <p className="text-gray-500">No evidence records found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('claim')}
            >
              Claim {renderSortIndicator('claim')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('result')}
            >
              Result {renderSortIndicator('result')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('typeOfResearch')}
            >
              Research Type {renderSortIndicator('typeOfResearch')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('article.title')}
            >
              Article {renderSortIndicator('article.title')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('article.year')}
            >
              Year {renderSortIndicator('article.year')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {evidence.map((item) => (
            <tr 
              key={item._id}
              onClick={() => onRowClick(item._id)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.claim}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {formatResult(item.result)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.typeOfResearch}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {item.article?.title || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.article?.year || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}