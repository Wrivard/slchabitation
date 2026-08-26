import { useEffect, useRef, useState } from 'react';
import { Phone } from 'lucide-react';
import { PubCTA } from './PubCTA';

/**
 * Barre d'appel à l'action flottante qui suit le défilement.
 * Elle apparaît une fois le héros dépassé et s'efface dès que le CTA final
 * ou le pied de page entre dans la fenêtre, pour ne jamais les masquer.
 * Les zones à éviter sont marquées par l'attribut `data-sticky-hide`.
 */
export function PubStickyCTA() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const update = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.7);

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('[data-sticky-hide]'));
    if (targets.length === 0) return;

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        setBlocked(intersecting.size > 0);
      },
      { threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const visible = scrolledPastHero && !blocked;
  const containerRef = useRef<HTMLDivElement>(null);

  // Quand la barre disparaît, le focus ne doit pas rester piégé dans un
  // sous-arbre `aria-hidden`.
  useEffect(() => {
    if (visible) return;
    const container = containerRef.current;
    const active = document.activeElement;
    if (container && active instanceof HTMLElement && container.contains(active)) {
      active.blur();
    }
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className={`pub-sticky-cta${visible ? ' is-visible' : ''}`}
      aria-hidden={!visible}
      inert={!visible}
      data-testid="sticky-cta"
      data-visible={visible ? 'true' : 'false'}
    >
      <a
        href="tel:5144048494"
        className="pub-sticky-cta__phone"
        tabIndex={visible ? undefined : -1}
        data-testid="link-sticky-phone"
        onClick={() => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'phone_click' });
        }}
      >
        <Phone className="h-4 w-4 text-primary" />
        <span className="sr-only md:not-sr-only">(514) 404-8494</span>
      </a>
      <PubCTA service="" className="pub-sticky-cta__button" testId="button-sticky-cta">
        Obtenir une soumission
      </PubCTA>
    </div>
  );
}
