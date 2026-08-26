import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const THEME_KEY = 'lms-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private _isDark$ = new BehaviorSubject<boolean>(true); // Default: dark mode
  readonly isDark$ = this._isDark$.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadStoredTheme();
  }

  /** Toggle between dark and light mode */
  toggle(): void {
    this.setDarkMode(!this._isDark$.value);
  }

  /** Get the current dark mode state */
  get isDark(): boolean {
    return this._isDark$.value;
  }

  /** Set dark mode explicitly */
  setDarkMode(dark: boolean): void {
    this._isDark$.next(dark);
    if (dark) {
      this.renderer.addClass(document.documentElement, 'dark-mode');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark-mode');
    }
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }

  /** Load persisted theme preference on startup */
  private loadStoredTheme(): void {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light') {
      this.setDarkMode(false);
    } else {
      // Default to dark mode
      this.setDarkMode(true);
    }
  }
}
