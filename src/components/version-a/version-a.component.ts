
import { Component, ChangeDetectionStrategy, signal, computed, output } from '@angular/core';

@Component({
  selector: 'app-version-a',
  templateUrl: './version-a.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionAComponent {
  cpf = signal('');
  errors = signal(0);
  completed = output<number>();

  formattedCpf = computed(() => {
    let v = this.cpf();
    if (v.length === 0) return '';
    v = v.slice(0, 11);
    return v
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  });

  isComplete = computed(() => this.cpf().length === 11);

  handleKey(key: string): void {
    if (/^\d$/.test(key)) {
      if (this.cpf().length < 11) {
        this.cpf.update(v => v + key);
      }
    } else if (key === 'backspace') {
      this.cpf.update(v => v.slice(0, -1));
      this.errors.update(e => e + 1);
    } else if (key === 'reset') {
      this.cpf.set('');
      this.errors.update(e => e + 1);
    } else if (key === 'qrcode') {
      // Placeholder action
      console.log('QR Code scan requested.');
    }
  }

  submit(): void {
    if (this.isComplete()) {
      // We do not send the CPF value to preserve privacy.
      this.completed.emit(this.errors());
    }
  }
}