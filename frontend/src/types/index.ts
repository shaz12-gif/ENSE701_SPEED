/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Centralized shared types and interfaces for SPEED frontend
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 */

// Article as stored in the database
export interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  submittedBy?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  [key: string]: any;
}

// Article form data (for submission)
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

// Evidence as stored in the database
export interface Evidence {
  _id: string;
  filename?: string;
  claim: string;
  result: 'agree' | 'disagree' | 'mixed';
  typeOfResearch: string;
  participantType: string;
  practiceId: string;
  articleId: string;
  article?: {
    title: string;
    authors: string;
    year: number;
    journal?: string;
    _id?: string;
  };


  practice?: {
    id?: string;
    _id?: string;
    name?: string;
  };
  description?: string;
  analystComments?: string;
  supportsClaim?: boolean;
  [key: string]: string | number | boolean | object | undefined;
}

// Evidence form data (for submission)
export interface EvidenceFormData {
  practiceId: string;
  claim: string;
  supportsClaim: boolean;
  result: 'agree' | 'disagree' | 'mixed';
  typeOfResearch: string;
  participantType?: string;
  analystComments?: string;
  description?: string;
  articleId?: string;
  title?: string;
  source?: string;
  year?: number;
}

// Practice as stored in the database
export interface Practice {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  evidences?: string[];
  evidenceCount?: number;
}

// For sortable fields in tables
export type SortableField = 'claim' | 'practiceName' | 'result' | 'year' | 'typeOfResearch' | 'participantType' | 'title' | 'averageRating';

// For ArticleCard action buttons
export interface ActionButton {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}