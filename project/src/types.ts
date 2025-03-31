export interface NutritionLog {
  id: string;
  userId: string;
  timestamp: string;
  foodName: string;
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
  imageUrl?: string;
  audioUrl?: string;
  textContent?: string;
}

export interface DashboardStats {
  totalUsers: number;
  dailyAnalyses: number;
  activeSubscriptions: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  plan: 'free' | 'pro';
  analysesCount: number;
}