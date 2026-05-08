export interface Statement {
  id: string;
  order: number;
  chinese: string;
  english: string;
  soundmark: string;
  isMastered: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  order: number;
  statements: Statement[];
  coursePackId: string;
  completionCount: number;
  statementIndex: number;
  video: string;
}
