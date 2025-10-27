import { Component, ChangeDetectionStrategy, effect, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'app-interface-feedback',
  templateUrl: './interface-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceFeedbackComponent {
  title = input.required<string>();
  description = input<string>('');
  helperText = input<string>('');
  continueLabel = input<string>('Continuar');
  initialScore = input<number | null>(null);
  initialComment = input<string>('');

  submitFeedback = output<{ score: number; feedback: string }>();

  score = signal<number | null>(null);
  comment = signal('');

  constructor() {
    effect(() => {
      this.score.set(this.initialScore());
    });

    effect(() => {
      this.comment.set(this.initialComment());
    });
  }

  canSubmit = computed(() => this.score() !== null);

  setScore(value: number): void {
    this.score.set(value);
  }

  onCommentChange(value: string): void {
    this.comment.set(value);
  }

  onSubmit(): void {
    const score = this.score();
    if (score === null) {
      return;
    }

    this.submitFeedback.emit({
      score,
      feedback: this.comment().trim(),
    });
  }
}
