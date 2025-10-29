import { Injectable } from '@angular/core';

type ClarityArgs = [string, ...unknown[]];

interface ClarityFunction {
  (...args: ClarityArgs): void;
  q?: ClarityArgs[];
}

declare global {
  interface Window {
    clarity?: ClarityFunction;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ClarityService {
  private readonly productionHosts = new Set<string>([
    'bolivaralencastro.github.io',
  ]);
  private readonly scriptId = 'ms-clarity-script';
  private readonly clarityProjectId = 'tts6uyw0yd';
  private clarityEnabled = false;
  private hasLoggedDisabledMessage = false;

  initialize(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const currentHost = window.location.hostname;
    if (!this.productionHosts.has(currentHost)) {
      this.clarityEnabled = false;
      if (!this.hasLoggedDisabledMessage) {
        console.info(`Microsoft Clarity desabilitado para o host "${currentHost}".`);
        this.hasLoggedDisabledMessage = true;
      }
      return;
    }

    this.clarityEnabled = true;
    this.hasLoggedDisabledMessage = false;

    if (document.getElementById(this.scriptId)) {
      return;
    }

    this.ensureClarityStub();

    const script = document.createElement('script');
    script.id = this.scriptId;
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${this.clarityProjectId}`;
    script.onerror = () => {
      console.error('Não foi possível carregar o Microsoft Clarity. Verifique sua conexão de rede.');
    };

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  /**
   * Sets a custom tag in Clarity. This is useful for segmenting recordings and heatmaps.
   * For example, you can tag which version of the A/B test is being viewed or the current
   * state of the application.
   * @param key The name of the tag (e.g., 'current_view').
   * @param value The value of the tag (e.g., 'Welcome', 'Test_VersionA').
   */
  setCustomTag(key: string, value: string | string[]): void {
    if (!this.clarityEnabled) {
      if (!this.hasLoggedDisabledMessage) {
        console.info('Microsoft Clarity está desabilitado neste ambiente. Nenhuma tag será enviada.');
        this.hasLoggedDisabledMessage = true;
      }
      return;
    }

    const clarity = this.getClarityFunction();
    if (clarity) {
      clarity('set', key, value);
    } else {
      // In a real production app, you might want more robust logging or handling.
      // For this project, a console warning is sufficient if the script fails to load.
      console.warn('Clarity tracking is not available. Could not set custom tag.');
    }
  }

  private getClarityFunction(): ClarityFunction | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const clarity = window.clarity;
    if (typeof clarity !== 'function') {
      return undefined;
    }

    return clarity;
  }

  private ensureClarityStub(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const existingClarity = window.clarity;
    if (typeof existingClarity === 'function') {
      return;
    }

    const clarityQueue: ClarityArgs[] = [];
    const clarityStub: ClarityFunction = (...args: ClarityArgs) => {
      clarityQueue.push(args);
    };

    clarityStub.q = clarityQueue;
    window.clarity = clarityStub;
  }
}
