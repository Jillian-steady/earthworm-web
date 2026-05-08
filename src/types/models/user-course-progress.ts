export interface UserProgress {
  courseId: string;
}

export interface UserRecentCoursePack {
  id: number;
  coursePackId: string;
  courseId: string;
  title: string;
  description: string;
  cover: string;
  isFree: boolean;
}
