import { Injectable, signal, computed } from '@angular/core';
import { Exercise, WorkoutDay, WorkoutLog, ExerciseLog, UserStats, WeeklyProgress } from '../models/exercise.model';
import { WORKOUT_DAYS, getWorkoutDay, getExercise } from '../data/workout-data';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  readonly workoutDays = signal<WorkoutDay[]>(WORKOUT_DAYS);
  readonly currentWorkout = signal<WorkoutLog | null>(null);
  readonly userStats = signal<UserStats>({
    totalWorkouts: 0,
    totalVolume: 0,
    totalSets: 0,
    totalReps: 0,
    personalRecords: {},
    streak: 0,
    lastWorkoutDate: null
  });
  
  readonly todayWorkout = computed(() => {
    const dayOfWeek = new Date().getDay();
    // Convert Sunday (0) to day 7, otherwise use day number
    const dayId = dayOfWeek === 0 ? 7 : dayOfWeek;
    return getWorkoutDay(dayId);
  });

  readonly weeklyProgress = computed<WeeklyProgress>(() => {
    const now = new Date();
    const startOfWeek = this.getStartOfWeek(now);
    const endOfWeek = this.getEndOfWeek(now);
    
    const logs = this.storageService.getWorkoutLogsByDateRange(
      this.formatDate(startOfWeek),
      this.formatDate(endOfWeek)
    );
    
    return {
      weekNumber: this.getWeekNumber(now),
      year: now.getFullYear(),
      startDate: this.formatDate(startOfWeek),
      endDate: this.formatDate(endOfWeek),
      completedDays: logs.map(log => log.dayId),
      totalVolume: logs.reduce((sum, log) => sum + log.totalVolume, 0),
      totalWorkouts: logs.filter(log => log.completed).length
    };
  });

  constructor(private storageService: StorageService) {
    // Load saved stats from storage
    const savedStats = this.storageService.getUserStats();
    this.userStats.set(savedStats);
  }

  getWorkoutDay(id: number): WorkoutDay | undefined {
    return getWorkoutDay(id);
  }

  getExercise(id: number): Exercise | undefined {
    return getExercise(id);
  }

  startWorkout(dayId: number): WorkoutLog {
    const log: WorkoutLog = {
      id: this.generateId(),
      date: this.formatDate(new Date()),
      dayId,
      exerciseLogs: [],
      totalVolume: 0,
      duration: 0,
      completed: false
    };
    this.currentWorkout.set(log);
    return log;
  }

  logExercise(exerciseLog: ExerciseLog): void {
    const current = this.currentWorkout();
    if (current) {
      const existingIndex = current.exerciseLogs.findIndex(
        el => el.exerciseId === exerciseLog.exerciseId
      );
      if (existingIndex >= 0) {
        current.exerciseLogs[existingIndex] = exerciseLog;
      } else {
        current.exerciseLogs.push(exerciseLog);
      }
      this.updateTotalVolume();
      this.currentWorkout.set({ ...current });
    }
  }

  completeWorkout(): void {
    const current = this.currentWorkout();
    if (current) {
      current.completed = true;
      this.storageService.saveWorkoutLog(current);
      this.updateUserStats(current);
      this.currentWorkout.set(null);
    }
  }

  cancelWorkout(): void {
    this.currentWorkout.set(null);
  }

  getWorkoutHistory(): WorkoutLog[] {
    return this.storageService.getWorkoutLogs();
  }

  getWorkoutLogsForDay(dayId: number): WorkoutLog[] {
    return this.storageService.getWorkoutLogsByDay(dayId);
  }

  calculateVolume(weights: number[], reps: number): number {
    return weights.reduce((sum, weight) => sum + (weight * reps), 0);
  }

  private updateTotalVolume(): void {
    const current = this.currentWorkout();
    if (current) {
      let totalVolume = 0;
      for (const log of current.exerciseLogs) {
        const exercise = this.getExercise(log.exerciseId);
        if (exercise && log.weights.length > 0) {
          const avgReps = this.parseReps(exercise.reps);
          totalVolume += this.calculateVolume(log.weights, avgReps);
        }
      }
      current.totalVolume = totalVolume;
    }
  }

  private updateUserStats(log: WorkoutLog): void {
    const stats = this.userStats();
    stats.totalWorkouts++;
    stats.totalVolume += log.totalVolume;
    
    let totalSets = 0;
    let totalReps = 0;
    
    for (const exerciseLog of log.exerciseLogs) {
      const exercise = this.getExercise(exerciseLog.exerciseId);
      if (exercise) {
        totalSets += exerciseLog.completedSets;
        totalReps += exerciseLog.completedSets * this.parseReps(exercise.reps);
        
        // Update PRs
        const maxWeight = Math.max(...exerciseLog.weights);
        const currentPR = stats.personalRecords[exercise.name] || 0;
        if (maxWeight > currentPR) {
          stats.personalRecords[exercise.name] = maxWeight;
        }
      }
    }
    
    stats.totalSets += totalSets;
    stats.totalReps += totalReps;
    
    // Update streak
    const lastDate = stats.lastWorkoutDate;
    const today = this.formatDate(new Date());
    if (lastDate) {
      const last = new Date(lastDate);
      const diff = Math.floor((new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        stats.streak++;
      } else if (diff > 1) {
        stats.streak = 1;
      }
    } else {
      stats.streak = 1;
    }
    stats.lastWorkoutDate = today;
    
    this.storageService.saveUserStats(stats);
    this.userStats.set({ ...stats });
  }

  private parseReps(reps: string): number {
    if (reps.includes('-')) {
      const parts = reps.split('-');
      return (parseInt(parts[0]) + parseInt(parts[1])) / 2;
    }
    if (reps.includes(' each')) {
      return parseInt(reps.replace(' each leg', '').replace(' each', ''));
    }
    return parseInt(reps) || 0;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  private getEndOfWeek(date: Date): Date {
    const start = this.getStartOfWeek(date);
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  }

  private getWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.ceil(diff / oneWeek);
  }
}
