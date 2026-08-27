import { useEffect, useRef } from 'react';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';

const htmlContent = `\n  <div class=\"utility_component\">\n    <div class=\"utility_form-block w-password-page w-form\">\n      <form id=\"email-form\" name=\"email-form\" data-name=\"Email Form\" action=\"/.wf_auth\" method=\"post\" class=\"utility_form w-password-page\" data-wf-page-id=\"694c3be9aafcbfe2290c3bd5\" data-wf-element-id=\"60d3fa3a5a19c1169cd58c4100000000000c\"><img width=\"106\" src=\"https://d3e54v103j8qbb.cloudfront.net/static/utility-lock.ae54711958.svg\" alt=\"\" class=\"utility_image\">\n        <h3>Protected Page</h3>\n        <div class=\"padding-xxsmall\"></div><input class=\"form_input w-password-page w-input\" autofocus=\"true\" maxlength=\"256\" name=\"pass\" data-name=\"field\" placeholder=\"Enter your password\" type=\"password\" id=\"pass\">\n        <div class=\"padding-xxsmall\"></div><input type=\"submit\" data-wait=\"Please wait...\" class=\"button w-password-page w-button\" value=\"Submit\">\n        <div class=\"form_message-error-wrapper w-password-page w-form-fail\">\n          <div class=\"form_message-error\">\n            <div>Incorrect password. Please try again.</div>\n          </div>\n        </div>\n        <div style=\"display:none\" class=\"w-password-page w-embed w-script\"><input type=\"hidden\" name=\"path\" value=\"<%WF_FORM_VALUE_PATH%>\"><input type=\"hidden\" name=\"page\" value=\"<%WF_FORM_VALUE_PAGE%>\"></div>\n        <div style=\"display:none\" class=\"w-password-page w-embed w-script\">\n          <script type=\"application/javascript\">(function _handlePasswordPageOnload() {\n	  if (/[?&]e=1(&|\$)/.test(document.location.search)) {\n	    document.querySelector('.w-password-page.w-form-fail').style.display = 'block';\n	  }\n	})()</script>\n        </div>\n      </form>\n    </div>\n  </div>\n`;

export default function Unauthorized() {
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

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <SiteHeader />

      <main
        className="flex-grow"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <SiteFooter />
    </div>
  );
}
