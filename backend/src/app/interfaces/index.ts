// Common interfaces that can be shared across the application

export interface Practice {
  id: number;
  name: string;
  description: string;
  evidenceCount: number;
}

export interface Evidence {
  id: number;
  practiceId: number;
  title: string;
  description: string;
  source: string;
  year: number;
}