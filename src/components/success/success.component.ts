import { Component, ChangeDetectionStrategy, input, computed, signal, inject } from '@angular/core';
import { DataLoggerService } from '../../services/data-logger.service';

interface DonationCenter {
  readonly city: string;
  readonly name: string;
  readonly url: string;
}

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent {
  private readonly dataLogger = inject(DataLoggerService);

  title = input<string>('');
  message = input.required<string>();
  timeA = input<number | null>(null);
  timeB = input<number | null>(null);
  displayMode = input<'success' | 'transition'>('success');

  private readonly donationDialogOpen = signal(false);

  readonly donationCenters: readonly DonationCenter[] = [
    { city: 'São Paulo', name: 'Pró-Sangue', url: 'https://www.prosangue.sp.gov.br/' },
    { city: 'Rio de Janeiro', name: 'Hemorio', url: 'https://www.hemorio.rj.gov.br/' },
    { city: 'Belo Horizonte', name: 'Hemominas', url: 'http://www.hemominas.mg.gov.br/' },
    { city: 'Brasília', name: 'Hemocentro de Brasília', url: 'https://www.hemocentro.df.gov.br/' },
    { city: 'Salvador', name: 'Hemoba', url: 'http://www.hemoba.ba.gov.br/' },
    { city: 'Fortaleza', name: 'Hemoce', url: 'https://www.hemoce.ce.gov.br/' },
    { city: 'Recife', name: 'Hemope', url: 'http://www.hemope.pe.gov.br/' },
    { city: 'Curitiba', name: 'Hemepar', url: 'https://www.hemepar.pr.gov.br/' },
    { city: 'Porto Alegre', name: 'Hemorgs', url: 'https://saude.rs.gov.br/hemorgs' },
    { city: 'Manaus', name: 'Hemoam', url: 'http://www.hemoam.am.gov.br/' },
    { city: 'Belém', name: 'Hemopa', url: 'https://www.hemopa.pa.gov.br/' },
    { city: 'Goiânia', name: 'Hemocentro de Goiás', url: 'https://www.hemocentro.org.br/' },
    { city: 'Florianópolis', name: 'Hemosc', url: 'https://www.hemosc.org.br/' },
    { city: 'Vitória', name: 'Hemoes', url: 'https://hemoes.es.gov.br/' },
    { city: 'Cuiabá', name: 'MT-Hemocentro', url: 'https://www.mt-hemocentro.saude.mt.gov.br/' },
  ];

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

  donationDialogVisible = computed(() => this.donationDialogOpen());

  openDonationDialog(): void {
    this.donationDialogOpen.set(true);
  }

  closeDonationDialog(): void {
    this.donationDialogOpen.set(false);
  }

  onCenterClick(center: DonationCenter): void {
    void this.dataLogger.logHemocentroClick(center);
  }
}
