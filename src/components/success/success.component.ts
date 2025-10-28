import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { DonationDialogService } from '../../services/donation-dialog.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent {
  private readonly donationDialogService = inject(DonationDialogService);

  title = input<string>('');
  message = input.required<string>();
  timeA = input<number | null>(null);
  timeB = input<number | null>(null);
  displayMode = input<'success' | 'transition'>('success');

  private formatTime(ms: number | null): string | null {
    if (ms === null) {
      return null;
    }
    return (ms / 1000).toFixed(1);
  }

  formattedTimeA = computed(() => this.formatTime(this.timeA()));
  formattedTimeB = computed(() => this.formatTime(this.timeB()));

  timeDifference = computed(() => {
    const timeA = this.timeA(); // Original
    const timeB = this.timeB(); // Nova

    if (timeA === null || timeB === null) {
      return null;
    }

    const diff = timeA - timeB; // Positive if B is faster
    const diffSeconds = Math.abs(diff / 1000).toFixed(1);

    if (diff > 500) { // B is faster, so time was saved
      return {
        label: 'Tempo Salvo',
        value: `${diffSeconds}s`,
        isImprovement: true,
      };
    } else if (diff < -500) { // A is faster, time was lost
      return {
        label: 'Tempo Extra',
        value: `${diffSeconds}s`,
        isImprovement: false,
      };
    } else { // Similar time
      return {
        label: 'Diferença',
        value: `~0s`,
        isImprovement: null,
      };
    }
  });

  openDonationDialog(): void {
    this.donationDialogService.openDialog();
  }
}
