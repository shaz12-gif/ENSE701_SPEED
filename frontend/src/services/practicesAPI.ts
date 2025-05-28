/**
 * API service for practices-related operations
 */

export interface Practice {
  id: string | number;
  name: string;
  description: string;
}

interface EvidenceSubmissionResponse {
  success: boolean;
  message: string;
  evidenceId?: string;
}

export const getAllPractices = async (): Promise<Practice[]> => {
  const response = await fetch('/api/practices');
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const data = await response.json();
  // Adjust if your API returns { data: Practice[] }
  return data.data || data;
};

export const getPracticeById = async (id: string | number): Promise<Practice> => {
  const response = await fetch(`/api/practices/${id}`);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const data = await response.json();
  return data.data || data;
};

export const submitEvidence = async (
  practiceId: string | number,
  evidenceData: Record<string, unknown>
): Promise<EvidenceSubmissionResponse> => {
  const response = await fetch(`/api/practices/${practiceId}/evidence`, {
    method: 'POST',
    body: JSON.stringify(evidenceData),
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to submit evidence');
  return response.json();
};