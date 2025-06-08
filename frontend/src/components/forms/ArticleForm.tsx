/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * Article Submission Form - Allows users to submit new research articles manually or via BibTeX import.
 */

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
  onSubmit: (data: ArticleFormData | FormData) => void;
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
  const [bibFile, setBibFile] = useState<File | null>(null);
  const [isParsingBib, setIsParsingBib] = useState(false);
  const [bibParseError, setBibParseError] = useState<string | null>(null);

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
      setBibFile(null);
      setBibParseError(null);
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

  const handleBibFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setBibFile(null);
      return;
    }
    
    const file = e.target.files[0];
    setBibFile(file);
    setBibParseError(null);
    
    if (file.name.endsWith('.bib')) {
      setIsParsingBib(true);
      try {
        const fileText = await file.text();
        const parsedBibData = parseBibTeX(fileText);
        
        if (parsedBibData) {
          setFormData({
            title: parsedBibData.title || '',
            authors: parsedBibData.authors || '',
            journal: parsedBibData.journal || parsedBibData.booktitle || '',
            year: parsedBibData.year ? Number(parsedBibData.year) : currentYear,
            volume: parsedBibData.volume || '',
            number: parsedBibData.number || '',
            pages: parsedBibData.pages || '',
            doi: parsedBibData.doi || '',
          });
        } else {
          setBibParseError('Could not parse the BibTeX file. Please check the format.');
        }
      } catch (err) {
        console.error('Error parsing BibTeX:', err);
        setBibParseError('Failed to parse the BibTeX file. Please try again or enter details manually.');
      } finally {
        setIsParsingBib(false);
      }
    }
  };

  interface ParsedBibTeXData extends ArticleFormData {
    booktitle?: string;
  }

  // Simple BibTeX parser function
  const parseBibTeX = (bibText: string): ParsedBibTeXData | null => {
    try {
      // Normalize line endings and trim trailing whitespace
      const normalized = bibText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

      // Match the first entry in the BibTeX file (robust to line endings)
      const entryMatch = normalized.match(/@(\w+)\s*\{\s*([^,]*),\s*([\s\S]*?)\}$/m);
      if (!entryMatch) return null;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const entryType = entryMatch[1];
      const entries: Record<string, string> = {};

      // Extract all key-value pairs (robust to line endings)
      const fieldsText = entryMatch[3];
      const fieldMatches = [...fieldsText.matchAll(/\s*(\w+)\s*=\s*\{([\s\S]*?)\}\s*,?/g)];

      fieldMatches.forEach(match => {
        const key = match[1].toLowerCase();
        let value = match[2].trim();

        // Handle the authors field specially to convert BibTeX format to a readable format
        if (key === 'author') {
          value = value
            .split(' and ')
            .map(author => author.trim())
            .join(', ');
        }

        entries[key] = value;
      });

      // Map common BibTeX fields to our form fields
      return {
        title: entries.title || '',
        authors: entries.author || '',
        journal: entries.journal || entries.booktitle || '',
        year: entries.year ? Number(entries.year) : new Date().getFullYear(),
        volume: entries.volume || '',
        number: entries.number || '',
        pages: entries.pages || '',
        doi: entries.doi || '',
      };
    } catch (error) {
      console.error('Error parsing BibTeX:', error);
      return null;
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ArticleFormData, string>> = {};
    
    // Only validate required fields if no BibTeX file is provided
    if (!bibFile) {
      if (!formData.title.trim()) errors.title = 'Title is required';
      if (!formData.authors.trim()) errors.authors = 'Authors are required';
      if (!formData.journal.trim()) errors.journal = 'Journal or conference name is required';
      
      if (!formData.year) {
        errors.year = 'Year is required';
      } else if (formData.year < 1900 || formData.year > currentYear + 1) {
        errors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }
    
    if (formData.doi && !/^10\.\d{4,9}\/[-.;()\/:A-Z0-9]+$/i.test(formData.doi)) {
      errors.doi = 'Please enter a valid DOI format (e.g., 10.1234/example.123)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // For BibTeX file upload, validation rules are different
    if (bibFile) {
      // If a BibTeX file is provided, create FormData with just the file
      const formDataWithFile = new FormData();
      formDataWithFile.append('bibFile', bibFile);
      formDataWithFile.append('submissionType', 'bibtex');
      onSubmit(formDataWithFile);
      return;
    }
    
    // Standard form validation for manual entry
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {/* BibTeX File Upload Section */}
      <div className="">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Quick Import from BibTeX</h3>
        <p className="text-sm text-blue-600 mb-4">
          Upload a BibTeX (.bib) file to automatically fill in article details.
        </p>
        
        <div className="form-group">
          <label htmlFor="bibFile" className="block text-sm font-medium mb-1">
            BibTeX File
          </label>
          <input
            type="file"
            id="bibFile"
            name="bibFile"
            accept=".bib"
            onChange={handleBibFileChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            disabled={isSubmitting || isParsingBib}
          />
          {isParsingBib && (
            <p className="text-blue-500 text-sm mt-1">Parsing BibTeX file...</p>
          )}
          {bibParseError && (
            <p className="text-red-500 text-sm mt-1">{bibParseError}</p>
          )}
          {bibFile && !bibParseError && (
            <p className="text-green-500 text-sm mt-1">
              File loaded: {bibFile.name}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {bibFile ? 'You can still edit the fields below if needed.' : 'Or fill in the details manually below.'}
          </p>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title {!bibFile && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          rows={2}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter article title"
          required={!bibFile}
        />
        {validationErrors.title && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="authors" className="block text-sm font-medium mb-1">
          Authors {!bibFile && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          id="authors"
          name="authors"
          value={formData.authors}
          onChange={handleChange}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.authors ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., Smith, J., Johnson, A."
          required={!bibFile}
        />
        {validationErrors.authors && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.authors}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="journal" className="block text-sm font-medium mb-1">
          Journal/Conference {!bibFile && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          id="journal"
          name="journal"
          value={formData.journal}
          onChange={handleChange}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.journal ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., IEEE Transactions on Software Engineering"
          required={!bibFile}
        />
        {validationErrors.journal && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.journal}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Year {!bibFile && <span className="text-red-500">*</span>}
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
            required={!bibFile}
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
          disabled={isSubmitting || isParsingBib}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : (isParsingBib ? 'Parsing File...' : 'Submit Article')}
        </button>
      </div>
    </form>
  );
}