export interface Improvement {
  id: string;
  text: string;
  type: 'improvement' | 'preservation';
  source: 'commander' | 'team';
  createdAt: string;
}

export interface DailyEntry {
  id: string;
  date: string;
  improvements: {
    [improvementId: string]: {
      attempted?: boolean;
      effortLevel?: number;
      initiative?: string;
      content?: string; // For preservation items
    };
  };
}

export interface UserData {
  userId: string;
  improvements: Improvement[];
  dailyEntries: DailyEntry[];
}

export interface ProgressCircle {
  id: string;
  date: string;
  averageEffort: number;
  totalImprovements: number;
  completedImprovements: number;
}