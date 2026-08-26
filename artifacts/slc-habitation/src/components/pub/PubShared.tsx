import { ReactNode, useEffect, useRef, useState } from 'react';
import { Check, Phone, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Tone = 'light' | 'dark';

/**
 * Table des matières des pages publicitaires.
 * Elle reste accessible pendant la lecture (collée sous l'en-tête) et
 * signale la section en cours de lecture.
 */
export function PubPageNav({ items }: { items: { href: string; label: string }[] }) {
  const [active, setActive] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = items
      .map((item) => ({ href: item.href, el: document.getElementById(item.href.slice(1)) }))
      .filter((entry): entry is { href: string; el: HTMLElement } => Boolean(entry.el));

    if (sections.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 24;
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

  // Sur mobile la liste défile horizontalement : l'entrée active doit rester visible.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !active) return;
    const link = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!link || list.scrollWidth <= list.clientWidth) return;
    const target = link.offsetLeft - (list.clientWidth - link.clientWidth) / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [active]);

  return (
    <nav ref={navRef} aria-label="Sections de la page" className="pub-toc" data-testid="pub-toc">
      <div className="pub-toc__inner">
        <span className="pub-toc__label" aria-hidden="true">
          Sur cette page
        </span>
        <div ref={listRef} className="pub-toc__list no-scrollbar">
          {items.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className="pub-toc__link"
                data-active={isActive ? 'true' : 'false'}
                aria-current={isActive ? 'true' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>
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
  caption?: string;
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
  return (
    <section
      id={id}
      className={`${surface === 'muted' ? 'border-y border-border bg-muted/30' : 'bg-background'} py-16 md:py-20`}
      data-testid="section-gallery"
    >
      <div className="container-large mx-auto max-w-7xl px-6">
        <PubSectionHeader className="mb-12 max-w-3xl" kicker={kicker} title={title} description={description} />
        {/* Colonnes façon galerie de la page d'accueil : les hauteurs alternent
            sans laisser de trous, contrairement à une grille à cellules fixes. */}
        <div className="pub-gallery">
          {images.map((image, index) => (
            <figure
              key={image.src}
              className={`pub-gallery__item pub-gallery__item--${index % 4 === 0 || index % 4 === 3 ? 'square' : 'wide'}`}
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="pub-gallery__image" />
              {image.caption && <figcaption className="pub-gallery__caption">{image.caption}</figcaption>}
            </figure>
          ))}
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
