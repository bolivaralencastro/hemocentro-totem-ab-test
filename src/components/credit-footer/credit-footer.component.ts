import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-credit-footer',
  standalone: true,
  templateUrl: './credit-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditFooterComponent {}
