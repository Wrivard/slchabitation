import { useEffect } from 'react';

/**
 * Chargement du moteur Webflow sur les pages converties.
 *
 * Les pages exportées par Webflow terminent leur corps par deux scripts :
 * jQuery, puis `js/webflow.js`. Ce dernier anime encore plusieurs éléments du
 * site (visionneuse de photos, menu mobile, curseurs), donc les pages
 * converties en React continuent de le charger, à l'identique, jusqu'à ce que
 * ces comportements soient repris en React (tâche « retirer l'ancien moteur
 * Webflow »).
 *
 * Deux précautions reprises du chargement précédent :
 *  - les scripts sont exécutés dans l'ordre, jQuery devant être prêt avant
 *    `webflow.js` ;
 *  - un script inséré après le chargement de la page manque les évènements
 *    `DOMContentLoaded` et `load` ; ses écouteurs sont donc rejoués, sans quoi
 *    le moteur ne s'initialiserait jamais.
 */

type LegacyScript = {
  src: string;
  integrity?: string;
  crossOrigin?: string;
};

const LEGACY_SCRIPTS: LegacyScript[] = [
  {
    src: 'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=694c3be8aafcbfe2290c3b7f',
    integrity: 'sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=',
    crossOrigin: 'anonymous',
  },
  { src: '/js/webflow.js' },
];

const MARKER_ATTRIBUTE = 'data-legacy-webflow';

function patchLateListeners() {
  const documentAddEventListener = document.addEventListener;
  const windowAddEventListener = window.addEventListener;

  const replay = (listener: EventListenerOrEventListenerObject, eventName: string) => {
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
      replay(listener, type);
      return;
    }
    documentAddEventListener.call(document, type, listener, options);
  }) as typeof document.addEventListener;

  window.addEventListener = ((...args: Parameters<typeof window.addEventListener>) => {
    const [type, listener, options] = args;
    if (type === 'load' && document.readyState === 'complete') {
      replay(listener, type);
      return;
    }
    windowAddEventListener.call(window, type, listener, options);
  }) as typeof window.addEventListener;

  return () => {
    document.addEventListener = documentAddEventListener;
    window.addEventListener = windowAddEventListener;
  };
}

export function useLegacyWebflowEngine() {
  useEffect(() => {
    let mounted = true;
    const inserted: HTMLScriptElement[] = [];

    const load = async () => {
      const restoreListeners = patchLateListeners();
      try {
        for (const script of LEGACY_SCRIPTS) {
          if (!mounted) return;

          const element = document.createElement('script');
          element.src = script.src;
          if (script.integrity) element.integrity = script.integrity;
          if (script.crossOrigin) element.crossOrigin = script.crossOrigin;
          element.async = false;
          element.setAttribute(MARKER_ATTRIBUTE, '');

          const finished = new Promise<void>((resolve) => {
            element.addEventListener('load', () => resolve(), { once: true });
            element.addEventListener('error', () => resolve(), { once: true });
          });

          document.body.appendChild(element);
          inserted.push(element);
          await finished;
        }
      } finally {
        restoreListeners();
      }
    };

    void load();

    return () => {
      mounted = false;
      /* Les scripts sont retirés pour être réexécutés à la page suivante :
         le moteur hérité s'initialise au chargement du script, pas à la
         demande. */
      for (const element of inserted) element.remove();
    };
  }, []);
}
