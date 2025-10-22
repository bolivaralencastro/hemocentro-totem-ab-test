import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataLoggerService {
  // IMPORTANT: Replace this placeholder with the actual Web App URL you got from Google Apps Script deployment.
  private readonly LOGGING_URL = 'https://script.google.com/macros/s/AKfycbwzMnn6P6g6xy5OAMJJGul8kgGi6vQDVuNdwwojjkLq-x-Ze5yYQ2i3UsBHQr6mKuQW/exec';

  private async postData(payload: object): Promise<void> {
    try {
      await fetch(this.LOGGING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Apps Script requires this header for POST body
        },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Use 'no-cors' to avoid CORS issues with Apps Script web apps from client-side
      });
      console.log('Successfully sent data:', payload);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
  
  async logTimings(timeA: number, timeB: number, errorsA: number, errorsB: number, order: string, timeDifference: number): Promise<void> {
    return this.postData({ timeA, timeB, errorsA, errorsB, order, timeDifference });
  }

  async logHemocentroClick(center: { city: string, name: string }): Promise<void> {
    return this.postData({ clickedCenter: center.name, city: center.city });
  }
}