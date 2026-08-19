import { useEffect, useRef } from 'react';

const htmlContent = `\n  <div class=\"utility_component\">\n    <div class=\"utility_form-block w-form\"><img src=\"https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg\" alt=\"\" class=\"utility_image\">\n      <h3>Page Not Found</h3>\n      <div class=\"padding-xxsmall\"></div>\n      <div>The page you are looking for doesn&#x27;t exist or has been moved</div>\n      <div class=\"padding-xxsmall\"></div>\n      <a href=\"index.html\" class=\"button w-button\">Go Home</a>\n    </div>\n  </div>\n  <script src=\"https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=694c3be8aafcbfe2290c3b7f\" type=\"text/javascript\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\" crossorigin=\"anonymous\"></script>\n  <script src=\"js/webflow.js\" type=\"text/javascript\"></script>\n`;

export default function NotFoundPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    const executeScripts = async () => {
      const scripts = Array.from(container.querySelectorAll('script'));
      const originalDocumentAddEventListener = document.addEventListener;
      const originalWindowAddEventListener = window.addEventListener;
      const replayReadyListener = (listener: EventListenerOrEventListenerObject, eventName: string) => {
        queueMicrotask(() => {
          const event = new Event(eventName);
          if (typeof listener === 'function') {
            listener(event);
          } else {
            listener.handleEvent(event);
          }
        });
      };

      document.addEventListener = ((...args: Parameters<typeof document.addEventListener>) => {
        const [type, listener, options] = args;
        if (type === 'DOMContentLoaded' && document.readyState !== 'loading') {
          replayReadyListener(listener, type);
          return;
        }
        originalDocumentAddEventListener.call(document, type, listener, options);
      }) as typeof document.addEventListener;

      window.addEventListener = ((...args: Parameters<typeof window.addEventListener>) => {
        const [type, listener, options] = args;
        if (type === 'load' && document.readyState === 'complete') {
          replayReadyListener(listener, type);
          return;
        }
        originalWindowAddEventListener.call(window, type, listener, options);
      }) as typeof window.addEventListener;

      try {
        for (const oldScript of scripts) {
          if (!mounted) return;
          if (oldScript.type && oldScript.type !== 'text/javascript' && oldScript.type !== 'application/javascript' && oldScript.type !== '') {
            continue;
          }

          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (oldScript.innerHTML) {
            newScript.innerHTML = oldScript.innerHTML;
          }
          newScript.async = false;

          const waitForScript = Boolean(newScript.src) && !oldScript.hasAttribute('async');
          const loaded = new Promise(resolve => {
            if (!waitForScript) {
              resolve(undefined);
              return;
            }
            newScript.addEventListener('load', () => resolve(undefined), { once: true });
            newScript.addEventListener('error', () => resolve(undefined), { once: true });
          });

          oldScript.parentNode?.replaceChild(newScript, oldScript);
          await loaded;
        }
      } finally {
        document.addEventListener = originalDocumentAddEventListener;
        window.addEventListener = originalWindowAddEventListener;
      }
    };

    void executeScripts();
    return () => {
      mounted = false;
    };
  }, []);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
