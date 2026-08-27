import { useRef } from 'react';

import { useBackToTop, useRevealOnScroll } from '@/lib/behaviors';

/**
 * Page technique de vérification des interactions.
 *
 * Elle n'est reliée à aucun menu et n'est pas indexée : elle sert de banc
 * d'essai aux comportements repris du site hérité (apparition au défilement,
 * bouton « retour en haut »), pour qu'un script automatisé puisse confirmer
 * qu'ils réagissent comme les scripts d'origine avant que les pages du site ne
 * soient converties.
 */
export default function VerificationInteractions() {
  const containerRef = useRef<HTMLDivElement>(null);

  useRevealOnScroll(containerRef);
  useBackToTop(containerRef);

  return (
    <div ref={containerRef} className="bg-background text-foreground">
      <section style={{ minHeight: '150vh', padding: '4rem 2rem' }}>
        <h1 data-testid="text-verification-title">Vérification des interactions</h1>
        <p>
          Faites défiler la page : les blocs suivants doivent apparaître l'un après l'autre, et le
          bouton de retour en haut doit se déplier après une demi-hauteur d'écran.
        </p>
      </section>

      <section
        data-reveal-group
        data-stagger="100"
        data-distance="2em"
        data-start="top 80%"
        style={{ padding: '4rem 2rem', display: 'grid', gap: '1.5rem' }}
      >
        <div data-testid="reveal-item-1">Premier bloc</div>
        <div data-testid="reveal-item-2">Deuxième bloc</div>
        <div data-ignore="false">
          <p data-testid="reveal-parent">Bloc parent d'un sous-groupe</p>
          <div data-reveal-group-nested data-stagger="50" style={{ display: 'grid', gap: '1rem' }}>
            <span data-testid="reveal-nested-1">Premier enfant imbriqué</span>
            <span data-testid="reveal-nested-2">Deuxième enfant imbriqué</span>
          </div>
        </div>
      </section>

      <section style={{ minHeight: '150vh', padding: '4rem 2rem' }}>
        <p>Zone de défilement.</p>
      </section>

      <div
        data-back-to-top="wrap"
        style={{ position: 'fixed', right: '2rem', bottom: '2rem', opacity: 0 }}
      >
        <button type="button" data-back-to-top="button" data-testid="button-back-to-top">
          Haut de page
        </button>
      </div>
    </div>
  );
}
