import { Component, ChangeDetectionStrategy, signal, computed, output } from '@angular/core';

@Component({
  selector: 'app-version-b',
  templateUrl: './version-b.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionBComponent {
  cpf = signal('');
  errors = signal(0);
  completed = output<number>();

  cpfDisplayParts = computed(() => {
    const cpfVal = this.cpf();
    
    const part1 = cpfVal.substring(0, 3).padEnd(3, '_');
    const part2 = cpfVal.substring(3, 6).padEnd(3, '_');
    const part3 = cpfVal.substring(6, 9).padEnd(3, '_');
    const part4 = cpfVal.substring(9, 11).padEnd(2, '_');

    const formatted = `${part1}.${part2}.${part3}-${part4}`;

    const parts: { value: string, isDigit: boolean }[] = [];
    if (formatted.length === 0) {
      return parts;
    }
    
    let currentPartValue = '';
    let isCurrentPartDigit = !['_', '.', '-'].includes(formatted[0]);

    for (const char of formatted) {
      const isCharDigit = !['_', '.', '-'].includes(char);
      if (isCharDigit === isCurrentPartDigit) {
        currentPartValue += char;
      } else {
        parts.push({ value: currentPartValue, isDigit: isCurrentPartDigit });
        currentPartValue = char;
        isCurrentPartDigit = isCharDigit;
      }
    }
    parts.push({ value: currentPartValue, isDigit: isCurrentPartDigit });
    
    return parts;
  });

  isComplete = computed(() => this.cpf().length === 11);
  isEmpty = computed(() => this.cpf().length === 0);

  handleKey(key: string): void {
    if (key >= '0' && key <= '9') {
      if (this.cpf().length < 11) {
        this.cpf.update(v => v + key);
      }
    } else if (key === 'backspace') {
      this.cpf.update(v => v.slice(0, -1));
      this.errors.update(e => e + 1);
    } else if (key === 'ok' && this.isComplete()) {
      this.submit();
    }
  }

  submit(): void {
    if (this.isComplete()) {
      this.completed.emit(this.errors());
    }
  }
}