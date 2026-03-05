import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../../core/services/workout.service';
import { DayCardComponent } from '../../shared/components/day-card/day-card.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DayCardComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section with Gradient Background -->
      <div class="relative overflow-hidden">
        <!-- Animated background gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-dark-950 to-accent-600/20 animate-pulse"></div>
        <div class="absolute inset-0">
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <header class="mb-10 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                  <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                  <path d="M6 8l-2 2a2 2 0 0 0 0 3l2 2"/>
                  <path d="M18 8l2 2a2 2 0 0 1 0 3l-2 2"/>
                  <path d="M8 12h8"/>
                  <path d="M6.5 19.5a2 2 0 0 1-3 0l-.5-.5a2 2 0 0 1 0-3l1.5-1.5"/>
                  <path d="M17.5 19.5a2 2 0 0 0 3 0l.5-.5a2 2 0 0 0 0-3l-1.5-1.5"/>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl md:text-5xl font-black text-gradient">{{ t('app.name') }}</h1>
                <p class="text-lg text-dark-400 mt-1">{{ t('app.subtitle') }}</p>
              </div>
            </div>
          </header>

          <!-- Power Stats Grid -->
          <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-slide-up">
            <!-- Streak Card -->
            <div class="stat-card group">
              <div class="stat-icon bg-gradient-to-br from-orange-500/30 to-red-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
                  <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value text-orange-400">{{ userStats().streak }}</span>
                <span class="stat-label">{{ t('dashboard.streak') }}</span>
              </div>
            </div>

            <!-- Workouts Card -->
            <div class="stat-card group">
              <div class="stat-icon bg-gradient-to-br from-green-500/30 to-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                  <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                  <path d="M8 12h8"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value text-green-400">{{ userStats().totalWorkouts }}</span>
                <span class="stat-label">{{ t('dashboard.workouts') }}</span>
              </div>
            </div>

            <!-- Volume Card -->
            <div class="stat-card group col-span-2 md:col-span-1">
              <div class="stat-icon bg-gradient-to-br from-primary-500/30 to-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value text-primary-400">{{ userStats().totalVolume | number }}</span>
                <span class="stat-label">{{ t('dashboard.kgLifted') }}</span>
              </div>
            </div>

            <!-- Personal Records Card -->
            <div class="stat-card group col-span-2">
              <div class="stat-icon bg-gradient-to-br from-accent-500/30 to-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value text-accent-400">{{ userStats().personalRecords }}</span>
                <span class="stat-label">{{ t('dashboard.personalRecords') }}</span>
              </div>
            </div>
          </section>

          <!-- Weekly Progress Section -->
          <section class="card mb-10 animate-scale-in">
            <div class="p-6 md:p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-white">{{ t('dashboard.weekProgress') }} {{ weeklyProgress().weekNumber }} {{ t('dashboard.progress') }}</h2>
                </div>
                <span class="badge badge-primary text-sm">{{ weeklyProgress().totalWorkouts }}/6 {{ t('dashboard.workoutsCount') }}</span>
              </div>
              
              <div class="progress-bar h-4 mb-4">
                <div class="progress-fill" [style.width.%]="(weeklyProgress().totalWorkouts / 6) * 100"></div>
              </div>
              
              <div class="flex justify-between text-sm text-dark-400">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ weeklyProgress().startDate }}
                </span>
                <span class="flex items-center gap-2">
                  {{ weeklyProgress().endDate }}
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </span>
              </div>
            </div>
          </section>

          <!-- Weekly Split Section -->
          <section class="card animate-slide-up">
            <div class="p-6 md:p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-white">{{ t('dashboard.weeklySplit') }}</h2>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                @for (day of workoutDays(); track day.id) {
                  <app-day-card
                    [day]="day"
                    [isCompleted]="weeklyProgress().completedDays.includes(day.id)"
                    [isToday]="todayWorkout()?.id === day.id"
                  />
                }
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private workoutService = inject(WorkoutService);
  private translationService = inject(TranslationService);
  
  workoutDays = this.workoutService.workoutDays;
  weeklyProgress = this.workoutService.weeklyProgress;
  todayWorkout = this.workoutService.todayWorkout;
  userStats = this.workoutService.userStats;

  t(key: string): string {
    return this.translationService.t(key);
  }
}
