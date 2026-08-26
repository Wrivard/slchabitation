import { ReactNode, useEffect, useId, useRef, useState } from 'react';

interface FAQProps {
  question: string;
  answer: ReactNode;
}

/**
 * Accordéon aligné sur l'apparence de la FAQ du vrai site (rangées séparées
 * par un filet, chevron à droite, ouverture animée en hauteur).
 */
export function FAQ({ question, answer }: FAQProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);
  const panelId = `faq-panel-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Au premier rendu, le panneau fermé reste simplement à zéro : pas
    // d'animation de fermeture au montage.
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      if (!open) return;
    }

    if (open) {
      panel.style.height = `${panel.scrollHeight}px`;
      const settle = (event: TransitionEvent) => {
        if (event.propertyName !== 'height') return;
        panel.style.height = 'auto';
      };
      panel.addEventListener('transitionend', settle);
      return () => panel.removeEventListener('transitionend', settle);
    }

    panel.style.height = `${panel.scrollHeight}px`;
    const frame = window.requestAnimationFrame(() => {
      panel.style.height = '0px';
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div className="pub-faq" data-open={open ? 'true' : 'false'}>
      <button
        type="button"
        className="pub-faq__summary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="pub-faq__question">{question}</span>
        <span className="pub-faq__icon" aria-hidden="true">
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </span>
      </button>
      <div id={panelId} ref={panelRef} className="pub-faq__panel" role="region" aria-hidden={!open}>
        <div className="pub-faq__answer">{answer}</div>
      </div>
    </div>
  );
}

export function FAQList({ children }: { children: ReactNode }) {
  return <div className="pub-faq-list">{children}</div>;
}
