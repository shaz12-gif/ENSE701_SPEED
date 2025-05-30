"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleForm, { ArticleFormData } from '@/components/forms/ArticleForm';
import { submitArticle } from '@/services/api';

/**
 * Article Submission Page
 * Allows users to submit new research articles to the SPEED database
 */
export default function SubmitArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetForm, setResetForm] = useState(false);

  const handleSubmit = async (formData: ArticleFormData | FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await submitArticle(formData);
      
      if (response.success) {
        setSubmitSuccess(true);
        setResetForm(true);
        // Reset form state and navigate after showing success message
        setTimeout(() => {
          setSubmitSuccess(false);
          setResetForm(false);
          router.push('/articles'); // Navigate to articles list
        }, 3000);
      } else {
        setError(response.message || 'Failed to submit article');
      }
    } catch (err) {
      console.error('Article submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Submit a Research Article</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Article submitted successfully! It will be reviewed by moderators.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Article Details</h2>
        <p className="text-gray-600 mb-6">
          Submit research articles for inclusion in the SPEED database. You can either upload a BibTeX file 
          or manually enter article details below. The submission will be reviewed by moderators before being added.
        </p>
        
        <ArticleForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          resetForm={resetForm}
        />
      </div>
    </div>
  );
}