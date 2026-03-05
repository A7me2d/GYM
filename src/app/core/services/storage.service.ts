import { Injectable } from '@angular/core';
import { WorkoutLog, WeeklyProgress, UserStats } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly WORKOUT_LOGS_KEY = 'hypertrophy_workout_logs';
  private readonly USER_STATS_KEY = 'hypertrophy_user_stats';
  private readonly THEME_KEY = 'hypertrophy_theme';

  // Workout Logs
  getWorkoutLogs(): WorkoutLog[] {
    const data = localStorage.getItem(this.WORKOUT_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveWorkoutLog(log: WorkoutLog): void {
    const logs = this.getWorkoutLogs();
    const existingIndex = logs.findIndex(l => l.id === log.id);
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    localStorage.setItem(this.WORKOUT_LOGS_KEY, JSON.stringify(logs));
  }

  deleteWorkoutLog(id: string): void {
    const logs = this.getWorkoutLogs().filter(l => l.id !== id);
    localStorage.setItem(this.WORKOUT_LOGS_KEY, JSON.stringify(logs));
  }

  getWorkoutLogsByDateRange(startDate: string, endDate: string): WorkoutLog[] {
    return this.getWorkoutLogs().filter(log => {
      return log.date >= startDate && log.date <= endDate;
    });
  }

  getWorkoutLogsByDay(dayId: number): WorkoutLog[] {
    return this.getWorkoutLogs().filter(log => log.dayId === dayId);
  }

  // User Stats
  getUserStats(): UserStats {
    const data = localStorage.getItem(this.USER_STATS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      totalSets: 0,
      totalReps: 0,
      personalRecords: {},
      streak: 0,
      lastWorkoutDate: null
    };
  }

  saveUserStats(stats: UserStats): void {
    localStorage.setItem(this.USER_STATS_KEY, JSON.stringify(stats));
  }

  // Theme
  getTheme(): 'dark' | 'light' {
    const theme = localStorage.getItem(this.THEME_KEY);
    return (theme as 'dark' | 'light') || 'dark';
  }

  saveTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem(this.WORKOUT_LOGS_KEY);
    localStorage.removeItem(this.USER_STATS_KEY);
  }
}
