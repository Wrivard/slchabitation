import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backupDir = path.join(__dirname, '../../.migration-backup');
const sourceDir = path.join(__dirname, 'site');
const pagesDir = path.join(__dirname, 'src/pages');
const requestedComponents = new Set(process.argv.slice(2));

const files = [
  { file: 'index.html', route: '/', component: 'Home' },
  { file: 'a-propos.html', route: '/a-propos.html', component: 'APropos' },
  { file: 'renovation.html', route: '/renovation.html', component: 'Renovation' },
  { file: 'agrandissement-construction-neuve.html', route: '/agrandissement-construction-neuve.html', component: 'Agrandissement' },
  { file: 'travaux-sur-mesure.html', route: '/travaux-sur-mesure.html', component: 'TravauxSurMesure' },
  { file: 'realisations.html', route: '/realisations.html', component: 'Realisations' },
  { file: 'soumission.html', route: '/soumission.html', component: 'Soumission' },
  { file: 'renovation-sous-sol.html', route: '/renovation-sous-sol.html', component: 'RenovationSousSol', source: 'site' },
  { file: 'renovation-salle-de-bain.html', route: '/renovation-salle-de-bain.html', component: 'RenovationSalleDeBain', source: 'site' },
  { file: 'renovation-cuisine.html', route: '/renovation-cuisine.html', component: 'RenovationCuisine', source: 'site' },
  { file: 'formulaire.html', route: '/formulaire.html', component: 'Formulaire', source: 'site' },
  { file: 'politique-de-cookie.html', route: '/politique-de-cookie.html', component: 'PolitiqueDeCookie' },
  { file: '401.html', route: '/401.html', component: 'Unauthorized' },
  { file: '404.html', route: '/404.html', component: 'NotFoundPage' },
  { file: 'style-guide-a2eb197e-ef3b-4620-ad8c-6507e3057840.html', route: '/style-guide-a2eb197e-ef3b-4620-ad8c-6507e3057840.html', component: 'StyleGuide' },
];

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

files
  .filter(({ component }) => requestedComponents.size === 0 || requestedComponents.has(component))
  .forEach(({ file, component, source }) => {
  const htmlPath = path.join(source === 'site' ? sourceDir : backupDir, file);
  if (!fs.existsSync(htmlPath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract body
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : content;
  
  // Replace `class=` with `class=` since we use dangerouslySetInnerHTML it doesn't matter.
  const escapedContent = bodyContent.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\$/g, '\\$').replace(/`/g, '\\`');
  const semanticImports = source === 'site'
    ? `import { enhanceAccessibility } from '../lib/enhanceAccessibility';
import { normalizePublicLinks } from '@/lib/normalize-public-links';
import { applyPageSemantics, getPageSemantics } from './pageSemantics';
`
    : '';
  const semanticSetup = source === 'site'
    ? `
const pageSemantics = getPageSemantics('${file}');
const semanticHtmlContent = applyPageSemantics(
  htmlContent,
  pageSemantics.imageAltText,
  pageSemantics.demoteSecondH1,
);
`
    : '';
  const renderedHtml = source === 'site'
    ? 'enhanceAccessibility(normalizePublicLinks(semanticHtmlContent))'
    : 'htmlContent';

  const componentCode = `import { useEffect, useRef } from 'react';
${semanticImports}

const htmlContent = \`${escapedContent}\`;
${semanticSetup}

export default function ${component}() {
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

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: ${renderedHtml} }} />;
}
`;

  fs.writeFileSync(path.join(pagesDir, `${component}.tsx`), componentCode);
  console.log(`Generated ${component}.tsx`);
  });
