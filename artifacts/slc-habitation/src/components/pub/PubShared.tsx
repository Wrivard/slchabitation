import { ReactNode, useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Star, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Tone = 'light' | 'dark';

export type PubNavItem = { href: string; label: string };

/**
 * Suit la section en cours de lecture pour les liens de sections placés dans
 * l'en-tête. Un seul appel sert les deux variantes d'affichage (en ligne sur
 * grand écran, barre défilante en dessous).
 */
export function usePubActiveSection(items: PubNavItem[]): string {
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = items
      .map((item) => ({ href: item.href, el: document.getElementById(item.href.slice(1)) }))
      .filter((entry): entry is { href: string; el: HTMLElement } => Boolean(entry.el));

    if (sections.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document.querySelector<HTMLElement>('.pub-site-header');
      const offset = (header?.getBoundingClientRect().bottom ?? 0) + 24;
      let current = '';
      for (const section of sections) {
        if (section.el.getBoundingClientRect().top <= offset) current = section.href;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return active;
}

/**
 * Liste des sections de la page, affichée dans l'en-tête.
 * `variant="inline"` s'insère dans la rangée du logo (écrans larges),
 * `variant="bar"` occupe une deuxième rangée défilante.
 */
export function PubNavLinks({
  items,
  active,
  variant,
}: {
  items: PubNavItem[];
  active: string;
  variant: 'inline' | 'bar';
}) {
  const listRef = useRef<HTMLDivElement>(null);

  // La barre défile horizontalement : l'entrée active doit rester visible.
  useEffect(() => {
    if (variant !== 'bar') return;
    const list = listRef.current;
    if (!list || !active) return;
    const link = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!link || list.scrollWidth <= list.clientWidth) return;
    const target = link.offsetLeft - (list.clientWidth - link.clientWidth) / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [active, variant]);

  return (
    <nav
      aria-label="Sections de la page"
      className={`pub-header-nav pub-header-nav--${variant}`}
      data-testid={variant === 'bar' ? 'pub-toc' : 'pub-header-nav-inline'}
    >
      <div ref={listRef} className="pub-header-nav__list no-scrollbar">
        {items.map((item) => {
          const isActive = active === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="pub-header-nav__link"
              data-active={isActive ? 'true' : 'false'}
              aria-current={isActive ? 'true' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * En-tête de section : source unique du rythme surtitre → titre → sous-textes.
 * `description` accepte plusieurs paragraphes pour éviter les paragraphes
 * ajoutés en frères isolés, qui cassaient l'espacement.
 */
export function PubSectionHeader({
  kicker,
  title,
  description,
  children,
  tone = 'light',
  className = 'max-w-3xl mb-12',
}: {
  kicker?: string;
  title: string;
  description?: string | string[];
  children?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const paragraphs = description === undefined ? [] : Array.isArray(description) ? description : [description];

  return (
    <div className={`pub-section-header${tone === 'dark' ? ' pub-section-header--dark' : ''} ${className}`.trim()}>
      {kicker && <p className="pub-section-header__kicker">{kicker}</p>}
      <h2 className="pub-section-header__title">{title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="pub-section-header__lede">
          {paragraph}
        </p>
      ))}
      {children}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Héros des pages publicitaires.
 * La photo reste lisible (dégradé latéral sur grand écran) et une bande de
 * vignettes montre tout de suite du vrai travail réalisé.
 * ----------------------------------------------------------------------- */

type PubImage = { src: string; alt: string; width: number; height: number };

export function PubHero({
  label,
  title,
  intro,
  badges,
  action,
  note,
  image,
  objectPosition = 'center 35%',
  thumbs = [],
  thumbsLabel = 'Réalisations récentes',
}: {
  label: string;
  title: string;
  intro: string;
  badges: { icon?: LucideIcon; text: string }[];
  action: ReactNode;
  note?: string;
  image: PubImage;
  objectPosition?: string;
  thumbs?: PubImage[];
  thumbsLabel?: string;
}) {
  return (
    <section className="pub-hero" data-testid="pub-hero">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        fetchPriority="high"
        className="pub-hero__image"
        style={{ objectPosition }}
      />
      <div className="pub-hero__scrim" aria-hidden="true" />
      <div className="pub-hero__inner">
        <div className="pub-hero__content fade-up">
          <ul className="pub-hero__badges">
            {badges.map(({ icon: Icon, text }) => (
              <li key={text} className="pub-hero__badge">
                {Icon && <Icon className="pub-hero__badge-icon" aria-hidden="true" strokeWidth={1.75} />}
                {text}
              </li>
            ))}
          </ul>
          <p className="pub-hero__label">{label}</p>
          <h1 className="pub-hero__title">{title}</h1>
          <p className="pub-hero__intro">{intro}</p>
          <div className="pub-hero__action">{action}</div>
          {note && <p className="pub-hero__note">{note}</p>}
        </div>
        {thumbs.length > 0 && (
          <aside className="pub-hero__aside" data-testid="hero-thumbs">
            <p className="pub-hero__aside-label">{thumbsLabel}</p>
            <div className="pub-hero__thumbs">
              {thumbs.map((thumb) => (
                <img
                  key={thumb.src}
                  src={thumb.src}
                  alt={thumb.alt}
                  width={thumb.width}
                  height={thumb.height}
                  loading="lazy"
                  className="pub-hero__thumb"
                />
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Bandeau de preuves : faits vérifiés, placés juste sous le héros.
 * Le contenu est volontairement identique sur les trois pages pour que la
 * promesse reste la même quel que soit le mot-clé qui amène le visiteur.
 * ----------------------------------------------------------------------- */

const proofItems: { icon: LucideIcon; value: string; text: string }[] = [
  { icon: Clock, value: 'Réponse sous 48 h', text: 'à chaque demande reçue' },
  { icon: Wallet, value: 'Estimation sans frais', text: 'visite comprise' },
  { icon: CheckCircle2, value: '500+ projets complétés', text: 'en 18 ans' },
  { icon: MapPin, value: 'Laval et les Laurentides', text: '9 municipalités desservies' },
];

export function PubProofBar() {
  return (
    <section className="pub-proof-bar pub-section-dark" aria-label="Ce que vous obtenez en nous écrivant" data-testid="proof-bar">
      <ul className="pub-proof-bar__list">
        {proofItems.map(({ icon: Icon, value, text }) => (
          <li key={value} className="pub-proof-bar__item">
            <Icon className="pub-proof-bar__icon" aria-hidden="true" strokeWidth={1.75} />
            <span>
              <span className="pub-proof-bar__value">{value}</span>
              <span className="pub-proof-bar__text">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Cartes
 * ----------------------------------------------------------------------- */

export function PubCard({
  tone = 'light',
  className = '',
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`pub-card${tone === 'dark' ? ' pub-card--dark' : ''} ${className}`.trim()}>{children}</article>
  );
}

export function PubCardMedia({
  src,
  alt,
  width,
  height,
  badge,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  badge?: string;
}) {
  return (
    <div className="pub-card__media">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" className="pub-card__image" />
      {badge && <span className="pub-card__badge">{badge}</span>}
    </div>
  );
}

export function PubCardBody({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`pub-card__body ${className}`.trim()}>{children}</div>;
}

export function PubCardIcon({ icon: Icon, className = '' }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={`pub-card__icon ${className}`.trim()} aria-hidden="true">
      <Icon className="h-6 w-6" strokeWidth={1.5} />
    </span>
  );
}

/**
 * Numéro d'étape : pastille carrée (la marque n'utilise pas d'angles arrondis),
 * avec une icône facultative alignée à l'opposé.
 */
export function PubCardNumber({ children, icon: Icon }: { children: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="pub-card__number-row">
      <span className="pub-card__number" aria-hidden="true">
        {children}
      </span>
      {Icon && <Icon className="pub-card__number-icon" aria-hidden="true" strokeWidth={1.5} />}
    </div>
  );
}

export function PubCardTitle({ children, rule = false }: { children: ReactNode; rule?: boolean }) {
  return <h3 className={`pub-card__title${rule ? ' pub-card__title--rule' : ''}`}>{children}</h3>;
}

export function PubCardText({ children }: { children: ReactNode }) {
  return <p className="pub-card__text">{children}</p>;
}

/** Liste à puces cochées : rend les blocs de texte plus faciles à parcourir. */
export function PubCardList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="pub-card__list">
      {items.map((item, index) => (
        <li key={index} className="pub-card__list-item">
          <Check className="pub-card__list-icon" aria-hidden="true" strokeWidth={2.5} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PubCardNote({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="pub-card__note">
      {Icon && (
        <span className="pub-card__note-icon" aria-hidden="true">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
      )}
      <div className="pub-card__note-content">
        <p className="pub-card__note-label">{label}</p>
        <p className="pub-card__note-text">{children}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Panneau de préparation (liste cochée sur deux colonnes)
 * ----------------------------------------------------------------------- */

export function PubChecklist({
  title,
  items,
  icon: Icon,
  tone = 'light',
  className = '',
}: {
  title: string;
  items: string[];
  icon?: LucideIcon;
  tone?: Tone;
  className?: string;
}) {
  return (
    <aside
      className={`pub-checklist${tone === 'dark' ? ' pub-checklist--dark' : ''} ${className}`.trim()}
      data-testid="checklist-panel"
    >
      <h3 className="pub-checklist__title">
        {Icon && (
          <span className="pub-checklist__icon" aria-hidden="true">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
        )}
        {title}
      </h3>
      <ul className="pub-checklist__list">
        {items.map((item) => (
          <li key={item} className="pub-checklist__item">
            <Check className="pub-checklist__check" aria-hidden="true" strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* --------------------------------------------------------------------------
 * Barre d'action : téléphone + soumission au bas des sections
 * ----------------------------------------------------------------------- */

export function PubActionBar({
  action,
  note,
  tone = 'light',
  className = '',
}: {
  action: ReactNode;
  note?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`pub-action-bar${tone === 'dark' ? ' pub-action-bar--dark' : ''} ${className}`.trim()}
      data-testid="action-bar"
    >
      <a href="tel:5144048494" className="pub-button pub-button--phone" data-testid="link-action-phone">
        <Phone className="pub-button__icon" aria-hidden="true" />
        (514) 404-8494
      </a>
      {action}
      {note && (
        <p className="pub-action-bar__note">
          <ShieldCheck className="pub-action-bar__note-icon" aria-hidden="true" strokeWidth={1.75} />
          <span>{note}</span>
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Galerie de réalisations
 * ----------------------------------------------------------------------- */

export interface PubGalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  /** Catégorie affichée en surtitre sur la tuile vedette. */
  category?: string;
  /** Nom court du projet, affiché en gros sur la tuile vedette. */
  project?: string;
}

function PubGalleryTile({
  image,
  variant,
  className = '',
}: {
  image: PubGalleryImage;
  variant: 'feature' | 'stack';
  className?: string;
}) {
  const label = variant === 'feature' ? image.project ?? image.caption : undefined;

  return (
    <figure className={`pub-gallery__item pub-gallery__item--${variant} ${className}`.trim()}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        className="pub-gallery__image"
      />
      {label ? (
        <figcaption className="pub-gallery__label">
          {image.category && <span className="pub-gallery__label-category">{image.category}</span>}
          <span className="pub-gallery__label-project">{label}</span>
        </figcaption>
      ) : (
        image.caption && <figcaption className="pub-gallery__caption">{image.caption}</figcaption>
      )}
    </figure>
  );
}

export function PubGallery({
  id,
  kicker,
  title,
  description,
  images,
  surface = 'background',
}: {
  id: string;
  kicker?: string;
  title: string;
  description?: string | string[];
  images: PubGalleryImage[];
  surface?: 'background' | 'muted';
}) {
  const paragraphs = description === undefined ? [] : Array.isArray(description) ? description : [description];

  /* Composition bento : une tuile vedette, une tuile panoramique et deux
     tuiles compactes. Le motif se répète par groupes de quatre et change de
     côté d'un groupe à l'autre ; un groupe incomplet reste plein. */
  const blocks: PubGalleryImage[][] = [];
  for (let index = 0; index < images.length; index += 4) {
    blocks.push(images.slice(index, index + 4));
  }

  return (
    <section
      id={id}
      className={`${surface === 'muted' ? 'border-y border-border bg-muted/30' : 'bg-background'} py-16 md:py-20`}
      data-testid="section-gallery"
    >
      <div className="container-large mx-auto max-w-7xl px-6">
        <div className="pub-gallery-head">
          <div className="pub-gallery-head__main">
            {kicker && <p className="pub-section-header__kicker">{kicker}</p>}
            <h2 className="pub-section-header__title pub-gallery-head__title">{title}</h2>
          </div>
          {paragraphs.length > 0 && (
            <div className="pub-gallery-head__aside">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="pub-section-header__lede pub-gallery-head__text">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="pub-gallery">
          {blocks.map((block, blockIndex) => {
            const [feature, ...stack] = block;
            const modifiers = [
              stack.length === 0 ? 'pub-gallery__block--single' : '',
              stack.length === 1 ? 'pub-gallery__block--pair' : '',
              stack.length >= 3 ? 'pub-gallery__block--bento' : '',
              stack.length > 0 && blockIndex % 2 === 1 ? 'pub-gallery__block--reverse' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={feature.src} className={`pub-gallery__block ${modifiers}`.trim()}>
                <PubGalleryTile image={feature} variant="feature" />
                  {stack.length > 0 && (
                  <div className="pub-gallery__stack">
                    {stack.map((image, stackIndex) => (
                      <PubGalleryTile
                        key={image.src}
                        image={image}
                        variant="stack"
                        className={`pub-gallery__item--stack-${stackIndex + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Témoignage
 * ----------------------------------------------------------------------- */

export function PubTestimonial({
  quote,
  author,
  role = 'Propriétaire',
  tone = 'light',
  image,
}: {
  quote: string;
  author: string;
  role?: string;
  tone?: Tone;
  image?: { src: string; alt: string };
}) {
  const figure = (
    <figure className={`pub-quote${tone === 'dark' ? ' pub-quote--dark' : ''}`} data-testid="testimonial">
      <span className="pub-quote__mark" aria-hidden="true">
        &ldquo;
      </span>
      <blockquote className="pub-quote__text">{quote}</blockquote>
      <figcaption className="pub-quote__author">
        <span className="pub-quote__rule" aria-hidden="true" />
        <span>
          <span className="pub-quote__name">{author}</span>
          <span className="pub-quote__role">{role}</span>
        </span>
      </figcaption>
    </figure>
  );

  if (!image) return figure;

  return (
    <div className="pub-quote-layout">
      <div className="pub-quote-layout__media">
        <img src={image.src} alt={image.alt} loading="lazy" className="pub-quote-layout__image" />
      </div>
      {figure}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Bloc de relance (invitation à discuter du projet)
 * ----------------------------------------------------------------------- */

export function PubInvite({
  kicker,
  title,
  description,
  action,
  tone = 'light',
  className = '',
}: {
  kicker?: string;
  title: string;
  description: string;
  action: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`pub-invite${tone === 'dark' ? ' pub-invite--dark' : ''} ${className}`.trim()}
      data-testid="invite-block"
    >
      <div className="pub-invite__content">
        {kicker && <p className="pub-invite__kicker">{kicker}</p>}
        <h2 className="pub-invite__title">{title}</h2>
        <p className="pub-invite__text">{description}</p>
      </div>
      <div className="pub-invite__action">{action}</div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Bande de photos commentées : montre le détail du travail sans rallonger
 * le texte. Fond foncé pour casser le rythme entre deux sections claires.
 * ----------------------------------------------------------------------- */

export function PubPhotoRow({
  id,
  kicker,
  title,
  description,
  items,
}: {
  id?: string;
  kicker?: string;
  title: string;
  description?: string;
  items: (PubImage & { caption: string; text: string })[];
}) {
  return (
    <section id={id} className="pub-section-dark pub-photo-row-section" data-testid="photo-row">
      <div className="container-large mx-auto max-w-7xl px-6">
        <PubSectionHeader
          className="mb-12 max-w-3xl"
          tone="dark"
          kicker={kicker}
          title={title}
          description={description}
        />
        <div className="pub-photo-row">
          {items.map((item) => (
            <figure key={item.src} className="pub-photo-row__figure">
              <div className="pub-photo-row__media">
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  className="pub-photo-row__image"
                />
              </div>
              <figcaption className="pub-photo-row__caption">
                <strong className="pub-photo-row__title">{item.caption}</strong>
                <span className="pub-photo-row__text">{item.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Avis Google déjà publiés (aucun avis inventé).
 * ----------------------------------------------------------------------- */

export function PubReviews({
  id = 'avis',
  kicker = 'Avis Google',
  title,
  description,
  items,
}: {
  id?: string;
  kicker?: string;
  title: string;
  description?: string;
  items: { quote: string; author: string; role?: string }[];
}) {
  return (
    <section id={id} className="pub-section-muted scroll-mt-20 border-y border-border py-16 md:py-20" data-testid="reviews">
      <div className="container-large mx-auto max-w-7xl px-6">
        <PubSectionHeader className="mb-12 max-w-3xl" kicker={kicker} title={title} description={description} />
        <div className="pub-reviews">
          {items.map((item) => (
            <figure key={item.author} className="pub-review" data-testid="review-card">
              <div className="pub-review__stars" role="img" aria-label="5 étoiles sur 5">
                {[0, 1, 2, 3, 4].map((index) => (
                  <Star key={index} className="pub-review__star" aria-hidden="true" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="pub-review__text">{item.quote}</blockquote>
              <figcaption className="pub-review__author">
                <span className="pub-review__name">{item.author}</span>
                <span className="pub-review__role">{item.role ?? 'Propriétaire'}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Zone desservie : reprend les municipalités déjà annoncées sur le site.
 * ----------------------------------------------------------------------- */

export function PubServiceArea({ cities, note, className = "" }: { cities: string[]; note: string; className?: string }) {
  return (
    <section className={`bg-background pt-12 pb-16 md:pt-16 md:pb-20 ${className}`.trim()} data-testid="service-area">
      <div className="container-large mx-auto max-w-7xl px-6">
        <div className="pub-area">
          <p className="pub-area__label">
            <MapPin className="pub-area__icon" aria-hidden="true" strokeWidth={1.75} />
            Nous travaillons à
          </p>
          <ul className="pub-area__list">
            {cities.map((city) => (
              <li key={city} className="pub-area__item">
                {city}
              </li>
            ))}
          </ul>
          <p className="pub-area__note">{note}</p>
        </div>
      </div>
    </section>
  );
}

export function PubFigure({ src, alt, width, height, caption, className = "" }: { src: string; alt: string; width: number; height: number; caption?: string; className?: string }) {
  return (
    <figure className={`overflow-hidden bg-muted ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {caption && (
        <figcaption className="pt-3 pb-1 px-1 text-sm font-medium text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
