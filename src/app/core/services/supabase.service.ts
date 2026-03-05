import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // Auth state signals
  private authState = signal<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  // Computed signals for easy access
  user = computed(() => this.authState().user);
  session = computed(() => this.authState().session);
  loading = computed(() => this.authState().loading);
  error = computed(() => this.authState().error);
  isAuthenticated = computed(() => !!this.authState().session);

  constructor() {
    this.supabase = createClient(
      'https://hbuqzlktxhurnfqgsfbs.supabase.co',
      'sb_publishable_62yDMegQYSBjxbH5gFJkdA_yFW-2o7N',
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );

    // Initialize auth state
    this.initAuth();

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.authState.update(state => ({
        ...state,
        session,
        user: session?.user ?? null,
        loading: false
      }));
    });
  }

  private async initAuth(): Promise<void> {
    try {
      // Clear any stuck locks first
      const lockKey = 'lock:sb-hbuqzlktxhurnfqgsfbs-auth-token';
      localStorage.removeItem(lockKey);
      
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;

      this.authState.set({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null
      });
    } catch (err) {
      // Clear all Supabase data and retry
      localStorage.removeItem('sb-hbuqzlktxhurnfqgsfbs-auth-token');
      
      this.authState.set({
        user: null,
        session: null,
        loading: false,
        error: null
      });
    }
  }

  // Auth methods
  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.authState.update(state => ({ ...state, loading: true, error: null }));

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      this.authState.update(state => ({ ...state, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    this.authState.update(state => ({
      ...state,
      user: data.user,
      session: data.session,
      loading: false
    }));

    return { success: true };
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.authState.update(state => ({ ...state, loading: true, error: null }));

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      this.authState.update(state => ({ ...state, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    this.authState.update(state => ({
      ...state,
      user: data.user,
      session: data.session,
      loading: false
    }));

    return { success: true };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.authState.set({
      user: null,
      session: null,
      loading: false,
      error: null
    });
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Get the Supabase client for database operations
  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Get current user ID
  getUserId(): string | null {
    return this.authState().user?.id ?? null;
  }
}
