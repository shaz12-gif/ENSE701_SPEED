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
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!formData.practiceId) {
        throw new Error("Please select a practice");
      }
      if (!evidenceFile) {
        throw new Error("Please select a file to upload");
      }

      // Prepare FormData for file upload
      const uploadData = new FormData();
      uploadData.append('file', evidenceFile);
      uploadData.append('practiceId', formData.practiceId);
      uploadData.append('title', formData.title);
      uploadData.append('source', formData.source);
      uploadData.append('year', String(formData.year));
      uploadData.append('description', formData.description);

      // Send to your backend upload endpoint
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Backend response:", result);

      if (result.success) {
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

        <div className="form-group">
          <label htmlFor="evidenceFile">Evidence File (.pdf or .bib)</label>
          <input
            type="file"
            id="evidenceFile"
            name="evidenceFile"
            accept=".pdf,.bib"
            onChange={handleFileChange}
            required
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