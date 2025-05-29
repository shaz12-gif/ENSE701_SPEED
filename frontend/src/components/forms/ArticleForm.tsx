import { useState, useEffect } from 'react';

export interface ArticleFormData {
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
}

interface ArticleFormProps {
  onSubmit: (data: ArticleFormData) => void;
  isSubmitting: boolean;
  resetForm?: boolean;
}

const currentYear = new Date().getFullYear();

export default function ArticleForm({ onSubmit, isSubmitting, resetForm = false }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    authors: '',
    journal: '',
    year: currentYear,
    volume: '',
    number: '',
    pages: '',
    doi: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ArticleFormData, string>>>({});

  // Reset form when resetForm prop changes to true
  useEffect(() => {
    if (resetForm) {
      setFormData({
        title: '',
        authors: '',
        journal: '',
        year: currentYear,
        volume: '',
        number: '',
        pages: '',
        doi: '',
      });
      setValidationErrors({});
    }
  }, [resetForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name as keyof ArticleFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ArticleFormData, string>> = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.authors.trim()) errors.authors = 'Authors are required';
    if (!formData.journal.trim()) errors.journal = 'Journal or conference name is required';
    
    if (!formData.year) {
      errors.year = 'Year is required';
    } else if (formData.year < 1900 || formData.year > currentYear + 1) {
      errors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }
    
    if (formData.doi && !/^10\.\d{4,9}\/[-.;()\/:A-Z0-9]+$/i.test(formData.doi)) {
      errors.doi = 'Please enter a valid DOI format (e.g., 10.1234/example.123)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="form-group">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <textarea
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          rows={2}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter article title"
          required
        />
        {validationErrors.title && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="authors" className="block text-sm font-medium mb-1">
          Authors <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="authors"
          name="authors"
          value={formData.authors}
          onChange={handleChange}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.authors ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., Smith, J., Johnson, A."
          required
        />
        {validationErrors.authors && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.authors}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="journal" className="block text-sm font-medium mb-1">
          Journal/Conference <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="journal"
          name="journal"
          value={formData.journal}
          onChange={handleChange}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.journal ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., IEEE Transactions on Software Engineering"
          required
        />
        {validationErrors.journal && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.journal}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1900"
            max={currentYear + 1}
            className={`w-full border rounded-md py-2 px-3 ${validationErrors.year ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {validationErrors.year && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.year}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="volume" className="block text-sm font-medium mb-1">
            Volume
          </label>
          <input
            type="text"
            id="volume"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            placeholder="e.g., 42"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="number" className="block text-sm font-medium mb-1">
            Number/Issue
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            placeholder="e.g., 3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pages" className="block text-sm font-medium mb-1">
            Pages
          </label>
          <input
            type="text"
            id="pages"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            placeholder="e.g., 123-145"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="doi" className="block text-sm font-medium mb-1">
          DOI
        </label>
        <input
          type="text"
          id="doi"
          name="doi"
          value={formData.doi}
          onChange={handleChange}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.doi ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., 10.1145/1234567.1234568"
        />
        {validationErrors.doi && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.doi}</p>
        )}
      </div>

      <div className="form-actions pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Article'}
        </button>
      </div>
    </form>
  );
}