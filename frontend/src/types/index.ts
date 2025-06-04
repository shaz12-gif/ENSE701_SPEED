/**
 * Represents an article in the SPEED database
 */
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
}

/**
 * Represents evidence for a software engineering practice
 */
export interface Evidence {
  _id: string;
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
  };
  // Add index signature to allow string key access
  [key: string]: string | number | boolean | object | undefined;
}

/**
 * Represents a software engineering practice
 */
export interface Practice {
  id?: string;
  _id?: string; // Support both id formats
  name: string;
}

// Add this to your types file
export interface EvidenceDetail {
  _id: string;
  articleId: string;
  practiceId: string;
  claim: string;
  supportsClaim: boolean;
  result: 'agree' | 'disagree' | 'mixed';
  typeOfResearch?: string;
  participantType?: string;
  description?: string;
  analystComments?: string;
  title?: string;
  practice?: {
    name: string;
  };
  article?: {
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
    moderator?: {
      id: string;
      notes: string;
    };
  };
}

// Define the SortableField type with all possible values
export type SortableField = 'claim' | 'result' | 'typeOfResearch' | 'participantType' | 'title' | 'year' | 'authors' | 'practiceName' | 'averageRating' | 'createdAt';

// Your other existing types stay here
