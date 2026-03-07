import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'workout/day/:id',
    loadComponent: () => import('./features/workout-day/workout-day.component').then(m => m.WorkoutDayComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exercise/:id',
    loadComponent: () => import('./features/exercise-details/exercise-details.component').then(m => m.ExerciseDetailsComponent),
    canActivate: [authGuard]
  },
  // Home Workout Routes
  {
    path: 'home-workout',
    loadComponent: () => import('./features/home-workout/home-dashboard/home-dashboard.component').then(m => m.HomeDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'home-workout/day/:id',
    loadComponent: () => import('./features/home-workout/home-workout-day/home-workout-day.component').then(m => m.HomeWorkoutDayComponent),
    canActivate: [authGuard]
  },
  {
    path: 'home-exercise/:id',
    loadComponent: () => import('./features/home-workout/home-exercise-details/home-exercise-details.component').then(m => m.HomeExerciseDetailsComponent),
    canActivate: [authGuard]
  },
  // Body Tracking Route
  {
    path: 'body-tracking',
    loadComponent: () => import('./features/body-tracking/body-tracking.component').then(m => m.BodyTrackingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
