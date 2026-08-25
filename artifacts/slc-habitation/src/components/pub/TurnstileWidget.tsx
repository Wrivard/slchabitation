import { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError: () => void;
  onResetRef?: (resetFn: () => void) => void;
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

export function TurnstileWidget({ onVerify, onError, onResetRef }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      return;
    }

    function renderWidget() {
      if (containerRef.current && window.turnstile && widgetIdRef.current === undefined) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onError,
          language: 'fr',
        });

        if (onResetRef && widgetIdRef.current !== undefined) {
          const currentId = widgetIdRef.current;
          onResetRef(() => {
            window.turnstile?.reset(currentId);
          });
        }
      }
    }

    if (!window.turnstile) {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[data-turnstile-loader="true"]',
      );
      const script = existingScript ?? document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstileLoader = 'true';
      script.dataset.cookieconsent = 'ignore';
      script.addEventListener('load', renderWidget, { once: true });
      if (!existingScript) document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current !== undefined && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [siteKey, onVerify, onError, onResetRef]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="my-4 min-h-[65px]" data-testid="turnstile-widget"></div>;
}
