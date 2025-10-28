import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DonationDialogService {
  private readonly open = signal(false);

  readonly isOpen = computed(() => this.open());

  openDialog(): void {
    this.open.set(true);
  }

  closeDialog(): void {
    this.open.set(false);
  }
}
