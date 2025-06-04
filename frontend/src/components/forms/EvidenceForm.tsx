import { useState, useEffect } from 'react';
import { getPractices } from '@/services/api';

interface EvidenceFormData {
  practiceId: string;
  claim: string;
  supportsClaim: boolean;
  result: string;
  typeOfResearch: string;
  participantType?: string;
  analystComments?: string;
  description?: string;
}

interface EvidenceFormProps {
  onSubmit: (data: EvidenceFormData) => void;
  isSubmitting: boolean;
}

// Update these to match the exact values expected by the backend
const researchTypes = [
  { id: 'case study', label: 'Case Study' },
  { id: 'experiment', label: 'Experiment' },
  { id: 'survey', label: 'Survey' },
  { id: 'literature review', label: 'Literature Review' },
  { id: 'other', label: 'Other' }
];

const participantTypes = [
  { id: 'students', label: 'Students' },
  { id: 'professionals', label: 'Professionals' },
  { id: 'mixed', label: 'Mixed' },
  { id: 'other', label: 'Other' }
];

// Predefined claims available for selection
const commonClaims = [
  'Improves code quality',
  'Reduces development time',
  'Increases team productivity',
  'Improves maintainability',
  'Reduces bugs',
  'Enhances collaboration',
  'Improves customer satisfaction',
  'Increases test coverage',
  'Reduces technical debt',
  'Speeds up onboarding'
];

export default function EvidenceForm({ onSubmit, isSubmitting }: EvidenceFormProps) {
  const [formData, setFormData] = useState<EvidenceFormData>({
    practiceId: '',
    claim: '',
    result: 'agree', // Default to agree
    typeOfResearch: '',
    participantType: '',
    supportsClaim: true, // Add this required property
  });
  
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof EvidenceFormData, string>>>({});
  const [practices, setPractices] = useState<{ id: string, name: string }[]>([]);
  const [loadingPractices, setLoadingPractices] = useState(true);
  const [practicesError, setPracticesError] = useState<string | null>(null);
  const [customClaim, setCustomClaim] = useState('');
  const [useCustomClaim, setUseCustomClaim] = useState(false);

  // Fetch SE practices
  useEffect(() => {
    async function fetchPractices() {
      try {
        const result = await getPractices();
        
        if (result.success) {
          setPractices(result.data as { id: string, name: string }[]);
        } else {
          throw new Error(result.message || 'Failed to fetch practices');
        }
      } catch (error) {
        console.error('Error fetching practices:', error);
        setPracticesError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoadingPractices(false);
      }
    }

    fetchPractices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name as keyof EvidenceFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleClaimChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'custom') {
      setUseCustomClaim(true);
      setFormData(prev => ({
        ...prev,
        claim: customClaim
      }));
    } else {
      setUseCustomClaim(false);
      setFormData(prev => ({
        ...prev,
        claim: value
      }));
    }
  };

  const handleCustomClaimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomClaim(e.target.value);
    setFormData(prev => ({
      ...prev,
      claim: e.target.value
    }));
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof EvidenceFormData, string>> = {};
    
    if (!formData.practiceId) errors.practiceId = 'Please select a practice';
    if (!formData.claim) errors.claim = 'Please enter or select a claim';
    if (!formData.typeOfResearch) errors.typeOfResearch = 'Please select a research type';
    if (!formData.participantType) errors.participantType = 'Please select a participant type';
    
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
        <label htmlFor="practiceId" className="block text-sm font-medium mb-1">
          Software Engineering Practice <span className="text-red-500">*</span>
        </label>
        
        {loadingPractices ? (
          <p className="text-sm text-gray-500">Loading practices...</p>
        ) : practicesError ? (
          <p className="text-sm text-red-500">{practicesError}</p>
        ) : (
          <select
            id="practiceId"
            name="practiceId"
            value={formData.practiceId}
            onChange={handleChange}
            className={`w-full border rounded-md py-2 px-3 ${validationErrors.practiceId ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option key="empty-practice" value="">Select a practice</option>
            {practices.map(practice => (
              <option key={practice.id} value={practice.id}>
                {practice.name}
              </option>
            ))}
          </select>
        )}
        
        {validationErrors.practiceId && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.practiceId}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="claim" className="block text-sm font-medium mb-1">
          Claim <span className="text-red-500">*</span>
        </label>
        
        <select
          id="claimSelect"
          value={useCustomClaim ? 'custom' : formData.claim}
          onChange={handleClaimChange}
          className={`w-full border rounded-md py-2 px-3 mb-2 ${validationErrors.claim ? 'border-red-500' : 'border-gray-300'}`}
          required
        >
          <option key="empty-claim" value="">Select a claim</option>
          {commonClaims.map((claim, index) => (
            <option key={`claim-${index}`} value={claim}>
              {claim}
            </option>
          ))}
          <option key="custom-claim" value="custom">Custom claim...</option>
        </select>
        
        {useCustomClaim && (
          <input
            type="text"
            id="claim"
            name="claim"
            value={customClaim}
            onChange={handleCustomClaimChange}
            className={`w-full border rounded-md py-2 px-3 ${validationErrors.claim ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter custom claim"
            required
          />
        )}
        
        {validationErrors.claim && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.claim}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="result" className="block text-sm font-medium mb-1">
          Result <span className="text-red-500">*</span>
        </label>
        <select
          id="result"
          name="result"
          value={formData.result}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md py-2 px-3"
          required
        >
          <option key="agree" value="agree">Agree (supports claim)</option>
          <option key="disagree" value="disagree">Disagree (refutes claim)</option>
          <option key="mixed" value="mixed">Mixed (partially supports/refutes)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="typeOfResearch" className="block text-sm font-medium mb-1">
          Research Type <span className="text-red-500">*</span>
        </label>
        <select
          id="typeOfResearch"
          name="typeOfResearch"
          value={formData.typeOfResearch}
          onChange={handleChange}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.typeOfResearch ? 'border-red-500' : 'border-gray-300'}`}
          required
        >
          <option key="empty-research" value="">Select research type</option>
          {researchTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
        {validationErrors.typeOfResearch && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.typeOfResearch}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="participantType" className="block text-sm font-medium mb-1">
          Participant Type <span className="text-red-500">*</span>
        </label>
        <select
          id="participantType"
          name="participantType"
          value={formData.participantType}
          onChange={handleChange}
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.participantType ? 'border-red-500' : 'border-gray-300'}`}
          required
        >
          <option key="empty-participant" value="">Select participant type</option>
          {participantTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
        {validationErrors.participantType && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.participantType}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="analystComments" className="block text-sm font-medium mb-1">
          Additional Comments
        </label>
        <textarea
          id="analystComments"
          name="analystComments"
          value={formData.analystComments || ''}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-md py-2 px-3"
          placeholder="Add any additional analysis, insights, or limitations from the study"
        />
      </div>

      <div className="form-actions pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
        </button>
      </div>
    </form>
  );
}