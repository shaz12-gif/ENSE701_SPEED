interface Practice {
  id: string;
  name: string;
}

interface FiltersProps {
  practices: Practice[];
  filters: {
    practiceId: string;
    claim: string;
    year: string;
    result: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

export default function EvidenceFilters({ practices, filters, onFilterChange }: FiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  
  const clearFilters = () => {
    onFilterChange('practiceId', '');
    onFilterChange('claim', '');
    onFilterChange('year', '');
    onFilterChange('result', '');
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Filter Evidence</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="form-group">
          <label htmlFor="practiceId" className="block text-sm font-medium mb-1">
            Practice
          </label>
          <select
            id="practiceId"
            name="practiceId"
            value={filters.practiceId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          >
            <option value="">All practices</option>
            {practices.map(practice => (
              <option key={practice.id} value={practice.id}>
                {practice.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="claim" className="block text-sm font-medium mb-1">
            Claim (contains)
          </label>
          <input
            type="text"
            id="claim"
            name="claim"
            value={filters.claim}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            placeholder="e.g., quality, productivity"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Publication Year
          </label>
          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          >
            <option value="">All years</option>
            {years.map(year => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="result" className="block text-sm font-medium mb-1">
            Result
          </label>
          <select
            id="result"
            name="result"
            value={filters.result}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          >
            <option value="">All results</option>
            <option value="agree">Agree (supports claim)</option>
            <option value="disagree">Disagree (refutes claim)</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>
      
      {(filters.practiceId || filters.claim || filters.year || filters.result) && (
        <div className="mt-4 text-right">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}