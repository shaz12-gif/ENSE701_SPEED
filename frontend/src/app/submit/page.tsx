"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubmitEvidenceForm() {
  const router = useRouter();
  type Practice = { id: string | number; name: string };
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    practiceId: '',
    title: '',
    source: '',
    year: new Date().getFullYear(),
    description: ''
  });

  // Fetch practices on component mount
  useEffect(() => {
    async function fetchPractices() {
      try {
        const response = await fetch('/api/practices');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setPractices(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch practices");
        }
      } catch (err) {
        console.error("Error fetching practices:", err);
        setError(
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPractices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Validate form
      if (!formData.practiceId) {
        throw new Error("Please select a practice");
      }

      // Make API call
      console.log(`Submitting evidence for practice ID: ${formData.practiceId}`);
      const response = await fetch(`/api/practices/${formData.practiceId}/evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          source: formData.source,
          year: formData.year,
          description: formData.description
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Redirect to practices page or show success message
        alert("Evidence submitted successfully!");
        router.push('/practices');
      } else {
        throw new Error(result.message || "Failed to submit evidence");
      }
    } catch (err) {
      console.error("Error submitting evidence:", err);
      setSubmitError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "An unknown error occurred"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading practices...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="submit-form">
      <h1>Submit New Evidence</h1>

      {submitError && (
        <div className="error-message">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="practiceId">Software Engineering Practice*</label>
          <select
            id="practiceId"
            name="practiceId"
            value={formData.practiceId}
            onChange={handleChange}
            required
          >
            <option value="">Select a practice</option>
            {practices.map((practice) => (
              <option key={practice.id} value={practice.id}>
                {practice.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <textarea
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="source">Source*</label>
          <input
            type="text"
            id="source"
            name="source"
            placeholder="Source (e.g., journal, conference, book)"
            value={formData.source}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1900"
            max="2100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Evidence'}
          </button>
          <Link href="/practices">Back to Practices</Link>
        </div>
      </form>
    </div>
  );
}