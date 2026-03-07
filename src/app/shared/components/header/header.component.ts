import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-xl border-b border-dark-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18">
          <!-- Logo -->
          <a routerLink="/dashboard" class="flex items-center gap-3 group">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <span class="text-xl font-black text-gradient hidden sm:block">{{ t('app.name') }}</span>
          </a>

          @if (isAuthenticated()) {
            <!-- Navigation -->
            <nav class="hidden md:flex items-center gap-2">
              <a 
                routerLink="/dashboard" 
                routerLinkActive="nav-link-active"
                class="nav-link"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                {{ t('nav.dashboard') }}
              </a>
              <a 
                routerLink="/analytics" 
                routerLinkActive="nav-link-active"
                class="nav-link"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                {{ t('nav.analytics') }}
              </a>
              <a 
                routerLink="/body-tracking" 
                routerLinkActive="nav-link-active"
                class="nav-link"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
                  <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
                </svg>
                {{ t('nav.bodyTracking') }}
              </a>
              <a 
                routerLink="/settings" 
                routerLinkActive="nav-link-active"
                class="nav-link"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                {{ t('nav.settings') }}
              </a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Language Switcher -->
              <button 
                (click)="toggleLanguage()"
                class="h-10 px-3 rounded-xl bg-dark-700/50 flex items-center gap-2 hover:bg-dark-700 transition-colors"
                [attr.aria-label]="isArabic() ? 'Switch to English' : 'التبديل إلى العربية'"
              >
                <span class="text-sm font-bold" [class.text-primary-400]="isArabic()" [class.text-dark-300]="!isArabic()">
                  {{ isArabic() ? 'EN' : 'ع' }}
                </span>
                <svg class="w-4 h-4 text-dark-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </button>

              <button 
                (click)="toggleTheme()"
                class="w-10 h-10 rounded-xl bg-dark-700/50 flex items-center justify-center hover:bg-dark-700 transition-colors"
                [attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
              >
                @if (isDarkMode()) {
                  <svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                } @else {
                  <svg class="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                }
              </button>

              <!-- Mobile menu button -->
              <button class="w-10 h-10 rounded-xl bg-dark-700/50 flex items-center justify-center hover:bg-dark-700 transition-colors md:hidden" (click)="toggleMobileMenu()">
                <svg class="w-5 h-5 text-dark-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          }
        </div>

        <!-- Mobile Navigation -->
        @if (isAuthenticated() && showMobileMenu) {
          <nav class="md:hidden py-4 border-t border-dark-700/50 animate-slide-down">
            <div class="flex flex-col gap-2">
              <a 
                routerLink="/dashboard" 
                routerLinkActive="nav-link-active"
                class="nav-link"
                (click)="showMobileMenu = false"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                {{ t('nav.dashboard') }}
              </a>
              <a 
                routerLink="/analytics" 
                routerLinkActive="nav-link-active"
                class="nav-link"
                (click)="showMobileMenu = false"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                {{ t('nav.analytics') }}
              </a>
              <a 
                routerLink="/body-tracking" 
                routerLinkActive="nav-link-active"
                class="nav-link"
                (click)="showMobileMenu = false"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
                  <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
                </svg>
                {{ t('nav.bodyTracking') }}
              </a>
              <a 
                routerLink="/settings" 
                routerLinkActive="nav-link-active"
                class="nav-link"
                (click)="showMobileMenu = false"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                {{ t('nav.settings') }}
              </a>
            </div>
          </nav>
        }
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  private themeService = inject(ThemeService);
  private translationService = inject(TranslationService);
  private supabaseService = inject(SupabaseService);
  
  isDarkMode = this.themeService.isDarkMode;
  isArabic = this.translationService.isArabic;
  isAuthenticated = this.supabaseService.isAuthenticated;
  showMobileMenu = false;

  ngOnInit(): void {
    this.translationService.initLanguage();
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
