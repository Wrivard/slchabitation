import { useEffect, useRef, useState } from 'react';

export type TurnstileStatus = 'loading' | 'ready' | 'unavailable';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError: () => void;
  onResetRef?: (resetFn: () => void) => void;
  onStatusChange?: (status: TurnstileStatus) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback': () => void;
          'expired-callback': () => void;
          language: string;
        },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({
  onVerify,
  onError,
  onResetRef,
  onStatusChange,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [siteKey, setSiteKey] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    onStatusChange?.('loading');

    async function loadSiteKey() {
      try {
        const response = await fetch('/api/turnstile-config', {
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
          signal: controller.signal,
        });
        const result: unknown = await response.json().catch(() => null);
        const configuredSiteKey =
          typeof result === 'object' &&
          result !== null &&
          'siteKey' in result &&
          typeof result.siteKey === 'string'
            ? result.siteKey.trim()
            : '';

        if (!response.ok || !configuredSiteKey) {
          throw new Error('Turnstile site key is unavailable');
        }

        if (active) setSiteKey(configuredSiteKey);
      } catch (error) {
        if (active && !(error instanceof DOMException && error.name === 'AbortError')) {
          setSiteKey(null);
          onStatusChange?.('unavailable');
          onError();
        }
      }
    }

    void loadSiteKey();

    return () => {
      active = false;
      controller.abort();
    };
  }, [onError, onStatusChange]);

  useEffect(() => {
    if (!siteKey) return;

    let active = true;
    let script: HTMLScriptElement | null = null;

    const renderWidget = () => {
      if (!active || !containerRef.current || !window.turnstile || widgetIdRef.current !== undefined) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          onVerify(token);
        },
        'error-callback': onError,
        'expired-callback': onError,
        language: 'fr',
      });
      onStatusChange?.('ready');

      if (onResetRef && widgetIdRef.current !== undefined) {
        const currentId = widgetIdRef.current;
        onResetRef(() => {
          window.turnstile?.reset(currentId);
        });
      }
    };

    const handleScriptError = () => {
      if (!active) return;
      onStatusChange?.('unavailable');
      onError();
    };

    if (!window.turnstile) {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[data-turnstile-loader="true"]',
      );
      script = existingScript ?? document.createElement('script');
      script.addEventListener('load', renderWidget, { once: true });
      script.addEventListener('error', handleScriptError, { once: true });
      if (!existingScript) {
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.turnstileLoader = 'true';
        script.dataset.cookieconsent = 'ignore';
        document.head.appendChild(script);
      }
    } else {
      renderWidget();
    }

    return () => {
      active = false;
      script?.removeEventListener('load', renderWidget);
      script?.removeEventListener('error', handleScriptError);
      if (widgetIdRef.current !== undefined && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [siteKey, onVerify, onError, onResetRef, onStatusChange]);

  if (!siteKey) {
    return <div className="my-4 min-h-[65px]" data-testid="turnstile-widget" aria-busy="true" />;
  }
  return <div ref={containerRef} className="my-4 min-h-[65px]" data-testid="turnstile-widget"></div>;
}
