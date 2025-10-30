import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DonationDialogService } from '../../services/donation-dialog.service';
import { DataLoggerService } from '../../services/data-logger.service';

interface DonationCenter {
  readonly city: string;
  readonly name: string;
  readonly url: string;
}

@Component({
  selector: 'app-donation-dialog',
  standalone: true,
  templateUrl: './donation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonationDialogComponent {
  private readonly donationDialogService = inject(DonationDialogService);
  private readonly dataLogger = inject(DataLoggerService);

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

  readonly isVisible = this.donationDialogService.isOpen;

  closeDialog(): void {
    this.donationDialogService.closeDialog();
  }

  onCenterClick(center: DonationCenter): void {
    void this.dataLogger.logHemocentroClick(center);
  }
}
