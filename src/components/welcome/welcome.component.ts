import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { TermsDialogComponent } from '../terms-dialog/terms-dialog.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TermsDialogComponent],
})
export class WelcomeComponent {
  showTerms = signal(false);
  startTest = output<void>();

  onStart(): void {
    this.startTest.emit();
  }

  toggleTerms(visible: boolean): void {
    this.showTerms.set(visible);
  }
}
