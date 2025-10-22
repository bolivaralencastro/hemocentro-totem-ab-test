
import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, effect } from '@angular/core';
import { VersionAComponent } from './components/version-a/version-a.component';
import { VersionBComponent } from './components/version-b/version-b.component';
import { SuccessComponent } from './components/success/success.component';
import { DataLoggerService } from './services/data-logger.service';
import { DonationInfoComponent } from './components/donation-info/donation-info.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ClarityService } from './services/clarity.service';

type AppState = 'Welcome' | 'Test1' | 'Test2' | 'Transition' | 'Finished';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WelcomeComponent, VersionAComponent, VersionBComponent, SuccessComponent, DonationInfoComponent],
})
export class AppComponent implements OnInit {
  private readonly dataLogger = inject(DataLoggerService);
  private readonly clarityService = inject(ClarityService);

  currentTest = signal<AppState>('Welcome');
  timeTestA = signal<number | null>(null);
  timeTestB = signal<number | null>(null);
  errorsTestA = signal<number | null>(null);
  errorsTestB = signal<number | null>(null);
  isMobile = signal(false);
  testOrder = signal<'AB' | 'BA' | null>(null);
  showSuccessInfo = signal(true);

  private startTime!: number;

  isShowingVersionA = computed(() => {
    const state = this.currentTest();
    const order = this.testOrder();
    return (state === 'Test1' && order === 'AB') || (state === 'Test2' && order === 'BA');
  });

  mainClass = computed(() => {
    if (this.isShowingVersionA()) {
      return 'bg-[#49455a] h-screen font-sans';
    }
    
    const centeredStates: AppState[] = ['Welcome', 'Test1', 'Test2', 'Transition', 'Finished'];
    if (centeredStates.includes(this.currentTest())) {
      return 'bg-gray-100 flex justify-center items-center min-h-screen p-4 md:p-8 font-sans';
    }

    return 'h-screen font-sans';
  });

  constructor() {
    this.trackClarityState();
  }

  ngOnInit(): void {
    this.checkIfMobile();
  }

  private trackClarityState(): void {
    effect(() => {
      const state = this.currentTest();
      // FIX: Explicitly type `viewName` as a string. This allows assigning more descriptive names for analytics
      // that are not part of the AppState type, resolving the type error.
      let viewName: string = state; // Default to the state name (e.g., 'Welcome', 'Transition')

      switch (state) {
        case 'Test1':
          // Identify if the user is seeing the Original (A) or New (B) interface
          viewName = this.testOrder() === 'AB' ? 'Test_VersionA' : 'Test_VersionB';
          break;
        case 'Test2':
          // Identify the second test view
          viewName = this.testOrder() === 'AB' ? 'Test_VersionB' : 'Test_VersionA';
          break;
        case 'Finished':
          // Differentiate between the final success message and the donation center list
          viewName = this.showSuccessInfo() ? 'Finished_Success' : 'Finished_DonationInfo';
          break;
      }
      
      this.clarityService.setCustomTag('current_view', viewName);
    });
  }

  private checkIfMobile(): void {
    if (window.innerWidth < 768) { // Common breakpoint for tablets and phones
      this.isMobile.set(true);
    }
  }

  onStartTest(): void {
    this.testOrder.set(Math.random() < 0.5 ? 'AB' : 'BA');
    this.startTime = Date.now();
    this.currentTest.set('Test1');
  }

  onTest1Completed(errorCount: number): void {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    if (this.testOrder() === 'AB') {
      this.timeTestA.set(duration);
      this.errorsTestA.set(errorCount);
    } else {
      this.timeTestB.set(duration);
      this.errorsTestB.set(errorCount);
    }
    this.currentTest.set('Transition');
  }

  onStartTest2(): void {
    this.startTime = Date.now(); // Reset timer for the second test
    this.currentTest.set('Test2');
  }

  onTest2Completed(errorCount: number): void {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    if (this.testOrder() === 'AB') {
      this.timeTestB.set(duration);
      this.errorsTestB.set(errorCount);
    } else {
      this.timeTestA.set(duration);
      this.errorsTestA.set(errorCount);
    }
    this.currentTest.set('Finished');
    this.showSuccessInfo.set(true);

    const timeA = this.timeTestA();
    const timeB = this.timeTestB();
    const errorsA = this.errorsTestA();
    const errorsB = this.errorsTestB();
    const order = this.testOrder();

    if (timeA !== null && timeB !== null && errorsA !== null && errorsB !== null && order !== null) {
      const timeDifference = timeA - timeB; // Positive means Original was slower
      const explicitOrder = order === 'AB' ? 'Original > Nova' : 'Nova > Original';
      void this.dataLogger.logTimings(timeA, timeB, errorsA, errorsB, explicitOrder, timeDifference);
    }
  }

  onFindCenterClick(): void {
    this.showSuccessInfo.set(false);
  }
}
