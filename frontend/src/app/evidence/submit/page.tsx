"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ArticleSelect from '@/components/forms/ArticleSelect';
import { getArticles, submitEvidence } from '@/services/api';

/**
 * Evidence Extraction Page
 * Allows analysts to add evidence from approved research articles
 */
export default function SubmitEvidencePage() {
  const router = useRouter();
  
  // State for articles and search
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleSearchTerm, setArticleSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  
  // Form data state
  const [formData, setFormData] = useState({
    articleId: '',
    practiceId: '',
    claim: '',
    supportsClaim: true,
    result: 'agree',
    title: '',
    source: '',
    year: new Date().getFullYear(),
    description: '',
    typeOfResearch: '',
    participantType: '',
    analystComments: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Research type options
  const researchTypes = [
    { value: 'case study', label: 'Case Study' },
    { value: 'experiment', label: 'Experiment' },
    { value: 'survey', label: 'Survey' },
    { value: 'literature review', label: 'Literature Review' },
    { value: 'other', label: 'Other' }
  ];
  
  // Participant type options
  const participantTypes = [
    { value: 'students', label: 'Students' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'mixed', label: 'Mixed (Students and Professionals)' },
    { value: 'other', label: 'Other' }
  ];
  
  // Fetch practices from API
  const [practices, setPractices] = useState<Practice[]>([]);
  
  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const response = await fetch('/api/practices');
        if (!response.ok) throw new Error('Failed to fetch practices');
        const data = await response.json();
        setPractices(data.data || data);
      } catch (err) {
        console.error('Error fetching practices:', err);
        toast.error('Failed to load practices');
      }
    };
    
    const fetchApprovedArticles = async () => {
      try {
        setIsLoading(true);
        const response = await getArticles({ status: 'approved' });
        if (response.success) {
          setArticles(response.data);
          setFilteredArticles(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch approved articles');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPractices();
    fetchApprovedArticles();
  }, []);
  
  // Filter articles when search term changes
  useEffect(() => {
    if (!articleSearchTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }
    
    const lowerCaseSearchTerm = articleSearchTerm.toLowerCase();
    const filtered = articles.filter(
      article => 
        article.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        article.authors.toLowerCase().includes(lowerCaseSearchTerm)
    );
    
    setFilteredArticles(filtered);
  }, [articleSearchTerm, articles]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'supportsClaim') {
      // Automatically set result based on supportsClaim checkbox
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        supportsClaim: isChecked,
        result: isChecked ? 'agree' : 'disagree'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle article search
  const handleArticleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleSearchTerm(e.target.value);
  };
  
  // Handle article selection
  const handleArticleSelect = (articleId: string) => {
    const selectedArticle = articles.find(article => article._id === articleId);
    
    setFormData(prev => ({
      ...prev,
      articleId,
      title: selectedArticle?.title || '',
      source: selectedArticle?.journal || '',
      year: selectedArticle?.year || new Date().getFullYear()
    }));
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.articleId) {
      toast.error('Please select an article');
      return false;
    }
    if (!formData.practiceId) {
      toast.error('Please select a practice');
      return false;
    }
    if (!formData.claim.trim()) {
      toast.error('Please enter a claim');
      return false;
    }
    if (!formData.typeOfResearch) {
      toast.error('Please select the type of research');
      return false;
    }
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await submitEvidence(formData);
      
      if (response.success) {
        toast.success('Evidence submitted successfully!');
        router.push('/evidence');
      } else {
        throw new Error(response.message || 'Failed to submit evidence');
      }
    } catch (err) {
      console.error('Error submitting evidence:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Submit Evidence from Research</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">1. Select an Approved Article</h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search articles by title, authors..."
              className="w-full p-2 border rounded"
              value={articleSearchTerm}
              onChange={handleArticleSearch}
            />
          </div>
          
          <ArticleSelect
            articles={filteredArticles}
            onSelect={handleArticleSelect}
            isLoading={isLoading}
            error={error}
          />
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">2. Evidence Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="practiceId" className="block text-sm font-medium mb-1">
                Software Engineering Practice <span className="text-red-500">*</span>
              </label>
              <select
                id="practiceId"
                name="practiceId"
                value={formData.practiceId}
                onChange={handleChange}
                required
                className="w-full border rounded-md py-2 px-3"
              >
                <option value="">Select a practice</option>
                {practices.map(practice => (
                  <option key={practice.id || practice._id} value={practice.id || practice._id}>
                    {practice.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="claim" className="block text-sm font-medium mb-1">
                Claim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="claim"
                name="claim"
                value={formData.claim}
                onChange={handleChange}
                required
                className="w-full border rounded-md py-2 px-3"
                placeholder="e.g., TDD improves code quality"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="form-group">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="supportsClaim"
                  checked={formData.supportsClaim}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span>This article supports this claim</span>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="form-group">
              <label htmlFor="typeOfResearch" className="block text-sm font-medium mb-1">
                Type of Research <span className="text-red-500">*</span>
              </label>
              <select
                id="typeOfResearch"
                name="typeOfResearch"
                value={formData.typeOfResearch}
                onChange={handleChange}
                required
                className="w-full border rounded-md py-2 px-3"
              >
                <option value="">Select research type</option>
                {researchTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="participantType" className="block text-sm font-medium mb-1">
                Participant Type
              </label>
              <select
                id="participantType"
                name="participantType"
                value={formData.participantType}
                onChange={handleChange}
                className="w-full border rounded-md py-2 px-3"
              >
                <option value="">Select participant type</option>
                {participantTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="form-group">
              <label htmlFor="analystComments" className="block text-sm font-medium mb-1">
                Analyst Comments
              </label>
              <textarea
                id="analystComments"
                name="analystComments"
                value={formData.analystComments}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-md py-2 px-3"
                placeholder="Additional comments or observations about the evidence"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
}

interface Practice {
  id?: string;
  _id?: string;
  name: string;
}