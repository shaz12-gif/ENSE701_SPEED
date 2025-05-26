/**
 * Author: Andrew Koves
 * ID: 20126313
 */

"use client";


/* useState and useEffect are react "hooks" that let youre store and update values,
and run code when the component loads or updates respectively. */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubmitEvidenceForm() {
  // Router instance for navigation after submission
  const router = useRouter();

  // Types for dropdowns
  type Practice = { id: string | number; name: string };
  type Claim = { id: string; text: string };

  // State management for form data and UI 
  // The state is what the user has typed in the form and what the application needs to display
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Predefined claims available for selection
  const claims: Claim[] = [
    { id: '1', text: 'Improves code quality' },
    { id: '2', text: 'Reduces development time' },
    { id: '3', text: 'Increases team productivity' },
    { id: '4', text: 'Improves maintainability' },
    { id: '5', text: 'Reduces bugs' },
    { id: '6', text: 'Enhances collaboration' }
  ];

  // Initializes form data
  const [formData, setFormData] = useState({
    practiceId: '',      
    claimId: '',         
    supportsClaim: true, 
    title: '',          
    source: '',          
    year: '',           
    description: ''      
  });

  // State for file upload
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  // Fetch available practices when page starts
  // This is the first thing that happens when the component is rendered
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

  // Updates the form when the user types or selects something
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // updates the file when the user selects a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  // runs when the user submits the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Validate required fields
      if (!formData.practiceId) {
        throw new Error("Please select a practice");
      }
      if (!formData.claimId) {
        throw new Error("Please select a claim");
      }

      // Create FormData object for submission
      const formPayload = new FormData();
      
      // Add always required fields
      formPayload.append('practiceId', formData.practiceId);
      formPayload.append('claimId', formData.claimId);
      formPayload.append('supportsClaim', String(formData.supportsClaim));

      if (evidenceFile) {
        // If file is uploaded add only the file
        formPayload.append('file', evidenceFile);
      } else {
        // Validate and add manual input fields if no file
        if (!formData.title) throw new Error("Please enter a title");
        if (!formData.source) throw new Error("Please enter a source");
        if (!formData.year) throw new Error("Please enter a year");

        formPayload.append('title', formData.title);
        formPayload.append('source', formData.source);
        formPayload.append('year', String(formData.year));
        if (formData.description) {
          formPayload.append('description', formData.description);
        }
      }

      // Submit to backend
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formPayload,
      });

      const result = await response.json();

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

  // Loading and error states
  if (loading) return <div className="loading">Loading practices...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Renders the actual form
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
          <label htmlFor="claimId">Claim*</label>
          <select
            id="claimId"
            name="claimId"
            value={formData.claimId}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select a claim</option>
            {claims.map((claim) => (
              <option key={claim.id} value={claim.id}>
                {claim.text}
              </option>
            ))}
          </select>
        </div>

        {formData.claimId && (
          <div className="form-group claim-support">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="supportsClaim"
                checked={formData.supportsClaim}
                onChange={(e) => 
                  setFormData(prev => ({
                    ...prev,
                    supportsClaim: e.target.checked
                  }))
                }
              />
              This evidence supports this claim
            </label>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">
            Title {!evidenceFile && <span className="required">*</span>}
          </label>
          <textarea
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required={!evidenceFile}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="source">
            Source {!evidenceFile && <span className="required">*</span>}
          </label>
          <input
            type="text"
            id="source"
            name="source"
            placeholder="Source (e.g., journal, conference, book)"
            value={formData.source}
            onChange={handleChange}
            required={!evidenceFile}
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">
            Year {!evidenceFile && <span className="required">*</span>}
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required={!evidenceFile}
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
          />
          <small className="form-help-text">
            If no file is uploaded, all fields below must be filled manually.
          </small>
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