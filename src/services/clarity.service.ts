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
   * Verifica se o script de rastreamento do Clarity está disponível no objeto window.
   * @returns {boolean} True se o Clarity estiver disponível, caso contrário, false.
   */
  private isClarityAvailable(): boolean {
    return this.clarityEnabled && typeof window !== 'undefined' && typeof window.clarity === 'function';
  }

  /**
   * Define uma tag personalizada no Clarity. Isso é útil para segmentar gravações e heatmaps.
   * Por exemplo, você pode marcar qual versão de um teste A/B está sendo exibida ou o estado
   * atual da aplicação.
   * @param key O nome da tag (ex: 'current_view').
   * @param value O valor da tag (ex: 'Welcome', 'Test_VersionA').
   */
  setCustomTag(key: string, value: string | string[]): void {
    if (!this.clarityEnabled) {
      if (!this.hasLoggedDisabledMessage) {
        console.info('Microsoft Clarity está desabilitado neste ambiente. Nenhuma tag será enviada.');
        this.hasLoggedDisabledMessage = true;
      }
      return;
    }

    if (this.isClarityAvailable()) {
      window.clarity('set', key, value);
    } else {
      // Em um aplicativo de produção real, você pode querer um log ou tratamento mais robusto.
      // Para este projeto, um aviso no console é suficiente se o script não carregar.
      console.warn('O rastreamento do Clarity não está disponível. Não foi possível definir a tag personalizada.');
    }
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