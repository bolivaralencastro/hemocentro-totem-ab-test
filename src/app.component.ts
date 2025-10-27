
import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, effect } from '@angular/core';
import { VersionAComponent } from './components/version-a/version-a.component';
import { VersionBComponent } from './components/version-b/version-b.component';
import { SuccessComponent } from './components/success/success.component';
import { DataLoggerService } from './services/data-logger.service';
import { DonationInfoComponent } from './components/donation-info/donation-info.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ClarityService } from './services/clarity.service';
import { InterfaceFeedbackComponent } from './components/interface-feedback/interface-feedback.component';

type AppState = 'Welcome' | 'Test1' | 'Feedback1' | 'Test2' | 'Feedback2' | 'Finished';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WelcomeComponent,
    VersionAComponent,
    VersionBComponent,
    SuccessComponent,
    DonationInfoComponent,
    InterfaceFeedbackComponent,
  ],
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
  scoreA = signal<number | null>(null);
  scoreB = signal<number | null>(null);
  feedbackA = signal('');
  feedbackB = signal('');
  lastCompletedInterface = signal<'A' | 'B' | null>(null);

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
    
    const centeredStates: AppState[] = ['Welcome', 'Test1', 'Feedback1', 'Test2', 'Feedback2', 'Finished'];
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
      let viewName: string = state; // Default to the state name (e.g., 'Welcome', 'Feedback1')

      switch (state) {
        case 'Test1':
          // Identify if the user is seeing the Original (A) or New (B) interface
          viewName = this.testOrder() === 'AB' ? 'Test_VersionA' : 'Test_VersionB';
          break;
        case 'Test2':
          // Identify the second test view
          viewName = this.testOrder() === 'AB' ? 'Test_VersionB' : 'Test_VersionA';
          break;
        case 'Feedback1':
          viewName = this.testOrder() === 'AB' ? 'Feedback_VersionA' : 'Feedback_VersionB';
          break;
        case 'Feedback2':
          viewName = this.testOrder() === 'AB' ? 'Feedback_VersionB' : 'Feedback_VersionA';
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
    this.timeTestA.set(null);
    this.timeTestB.set(null);
    this.errorsTestA.set(null);
    this.errorsTestB.set(null);
    this.scoreA.set(null);
    this.scoreB.set(null);
    this.feedbackA.set('');
    this.feedbackB.set('');
    this.lastCompletedInterface.set(null);
    this.showSuccessInfo.set(true);
    this.currentTest.set('Test1');
  }

  onTest1Completed(errorCount: number): void {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    if (this.testOrder() === 'AB') {
      this.timeTestA.set(duration);
      this.errorsTestA.set(errorCount);
      this.lastCompletedInterface.set('A');
    } else {
      this.timeTestB.set(duration);
      this.errorsTestB.set(errorCount);
      this.lastCompletedInterface.set('B');
    }
    this.currentTest.set('Feedback1');
  }

  onTest2Completed(errorCount: number): void {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    if (this.testOrder() === 'AB') {
      this.timeTestB.set(duration);
      this.errorsTestB.set(errorCount);
      this.lastCompletedInterface.set('B');
    } else {
      this.timeTestA.set(duration);
      this.errorsTestA.set(errorCount);
      this.lastCompletedInterface.set('A');
    }
    this.currentTest.set('Feedback2');
  }

  onFirstFeedbackSubmitted(feedback: { score: number; feedback: string }): void {
    const order = this.testOrder();
    if (order === null) {
      return;
    }

    if (order === 'AB') {
      this.scoreA.set(feedback.score);
      this.feedbackA.set(feedback.feedback);
    } else {
      this.scoreB.set(feedback.score);
      this.feedbackB.set(feedback.feedback);
    }

    this.startTime = Date.now();
    this.currentTest.set('Test2');
  }

  onSecondFeedbackSubmitted(feedback: { score: number; feedback: string }): void {
    const order = this.testOrder();
    if (order === null) {
      return;
    }

    if (order === 'AB') {
      this.scoreB.set(feedback.score);
      this.feedbackB.set(feedback.feedback);
    } else {
      this.scoreA.set(feedback.score);
      this.feedbackA.set(feedback.feedback);
    }

    this.currentTest.set('Finished');
    this.showSuccessInfo.set(true);
    this.logSurveyResults();
  }

  private logSurveyResults(): void {
    const timeA = this.timeTestA();
    const timeB = this.timeTestB();
    const errorsA = this.errorsTestA();
    const errorsB = this.errorsTestB();
    const order = this.testOrder();

    if (timeA === null || timeB === null || errorsA === null || errorsB === null || order === null) {
      return;
    }

    const timeDifference = timeA - timeB; // Positive means Original was slower
    const explicitOrder = order === 'AB' ? 'Original > Nova' : 'Nova > Original';
    const deviceType = this.isMobile() ? 'Mobile' : 'Desktop';

    const feedbackSegments: string[] = [];
    const feedbackOriginal = this.feedbackA().trim();
    const feedbackNew = this.feedbackB().trim();

    if (feedbackOriginal.length > 0) {
      feedbackSegments.push(`[Original] ${feedbackOriginal}`);
    }

    if (feedbackNew.length > 0) {
      feedbackSegments.push(`[Nova] ${feedbackNew}`);
    }

    const combinedFeedback = feedbackSegments.join(' | ');
    const feedbackWithDevice = `[device:${deviceType}]${combinedFeedback ? ` ${combinedFeedback}` : ''}`;

    void this.dataLogger.logSurveyResults(
      timeA,
      timeB,
      errorsA,
      errorsB,
      explicitOrder,
      timeDifference,
      this.scoreA(),
      this.scoreB(),
      feedbackWithDevice,
    );
  }

  onFindCenterClick(): void {
    this.showSuccessInfo.set(false);
  }
}
