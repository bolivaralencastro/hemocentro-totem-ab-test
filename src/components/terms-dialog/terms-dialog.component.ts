import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsDialogComponent {
  close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
