import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { WorkoutService } from '../services/workout.service';
import { firstValueFrom, filter, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const workoutService = inject(WorkoutService);
  const router = inject(Router);

  // Wait for auth to finish loading
  while (supabaseService.loading()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (supabaseService.isAuthenticated()) {
    // Initialize workout data from API
    await workoutService.initialize();
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const publicGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Wait for auth to finish loading
  while (supabaseService.loading()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!supabaseService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/dashboard']);
  return false;
};
