"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getArticles, submitEvidence } from '@/services/api';
import EvidenceForm from '@/components/forms/EvidenceForm';
import ArticleSelect from '@/components/forms/ArticleSelect';
import ProtectedRoute from '@/components/navigation/ProtectedRoute';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
}

export interface EvidenceFormData {
  practiceId: string;
  claim: string;
  supportsClaim: boolean;
  result: string;
  typeOfResearch: string;
  participantType?: string;
  analystComments?: string;
  description?: string;
}

/**
 * Evidence Extraction Page
 * 
 * Allows analysts to add new evidence extracted from an approved article.
 * Connects research articles to software engineering practices and claims.
 */
export default function EvidenceExtractionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  // Fetch approved articles
  useEffect(() => {
    async function fetchApprovedArticles() {
      try {
        const result = await getArticles({ status: 'approved' });
        
        if (result.success) {
          setArticles(result.data as Article[]);
        } else {
          throw new Error(result.message || 'Failed to fetch approved articles');
        }
      } catch (error) {
        console.error('Error fetching approved articles:', error);
        setArticlesError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoadingArticles(false);
      }
    }

    fetchApprovedArticles();
  }, []);

  const handleArticleSelect = (articleId: string) => {
    const article = articles.find(a => a._id === articleId);
    setSelectedArticle(article || null);
  };

  const handleSubmit = async (formData: EvidenceFormData) => {
    if (!selectedArticle) {
      setSubmitError('Please select an article first');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Combine form data with selected article
      const evidenceData = {
        ...formData,
        articleId: selectedArticle._id,
        title: selectedArticle.title,
        source: selectedArticle.journal,
        year: selectedArticle.year,
        // Set supportsClaim based on result
        supportsClaim: formData.result === 'agree' ? true : false
      };
      
      const result = await submitEvidence(evidenceData);
      
      if (result.success) {
        setSubmitSuccess(true);
        // Navigate to the evidence page after a brief success message
        setTimeout(() => {
          router.push('/evidence/browse');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to submit evidence');
      }
    } catch (error) {
      console.error('Error submitting evidence:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Evidence Extraction</h1>
        
        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>Evidence submitted successfully! Redirecting...</p>
          </div>
        )}
        
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{submitError}</p>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Select an Approved Article</h2>
          <ArticleSelect
            articles={articles}
            onSelect={handleArticleSelect}
            isLoading={loadingArticles}
            error={articlesError}
          />
        </div>
        
        {selectedArticle && (
          <div>
            <h2 className="text-xl font-semibold mb-4">2. Extract Evidence</h2>
            <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded">
              <h3 className="font-semibold text-lg">{selectedArticle.title}</h3>
              <p className="text-sm text-gray-600">{selectedArticle.authors}, {selectedArticle.journal}, {selectedArticle.year}</p>
            </div>
            
            <EvidenceForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}