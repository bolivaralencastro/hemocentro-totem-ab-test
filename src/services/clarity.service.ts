import { Injectable } from '@angular/core';

// Declares the Clarity function to be available on the window object for TypeScript.
declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ClarityService {
  /**
   * Checks if the Clarity tracking script is available on the window object.
   * @returns {boolean} True if Clarity is available, otherwise false.
   */
  private isClarityAvailable(): boolean {
    return typeof window.clarity === 'function';
  }
  
  /**
   * Sets a custom tag in Clarity. This is useful for segmenting recordings and heatmaps.
   * For example, you can tag which version of the A/B test is being viewed or the current
   * state of the application.
   * @param key The name of the tag (e.g., 'current_view').
   * @param value The value of the tag (e.g., 'Welcome', 'Test_VersionA').
   */
  setCustomTag(key: string, value: string | string[]): void {
    if (this.isClarityAvailable()) {
      window.clarity('set', key, value);
    } else {
      // In a real production app, you might want more robust logging or handling.
      // For this project, a console warning is sufficient if the script fails to load.
      console.warn('Clarity tracking is not available. Could not set custom tag.');
    }
  }
}
