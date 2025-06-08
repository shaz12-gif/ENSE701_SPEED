/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * Article Submission Page - Allows users to submit new research articles to the SPEED database.
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/forms/ArticleForm';
import { ArticleFormData } from '@/types';
import { submitArticle } from '@/services/api';
import ErrorMessage from '@/components/common/ErrorMessage';
import SuccessMessage from '../../../components/common/SuccessMessage';

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
        setTimeout(() => {
          setSubmitSuccess(false);
          setResetForm(false);
          router.push('/articles');
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
        <SuccessMessage message="Article submitted successfully! It will be reviewed by moderators." />
      )}

      {error && (
        <ErrorMessage message={error} />
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