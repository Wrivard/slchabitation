import { ReactNode } from 'react';

export function PubPageNav({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Navigation de la page" className="border-b border-border bg-background">
      <div className="container-large mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-5 no-scrollbar">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary !no-underline"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function PubSectionHeader({
  kicker,
  title,
  description,
  children,
  tone = 'light',
  className = "max-w-3xl mb-12",
}: {
  kicker?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const isDark = tone === 'dark';

  return (
    <div className={className}>
      {kicker && (
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">
          {kicker}
        </p>
      )}
      <h2 className={`mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl ${isDark ? 'text-white' : 'text-foreground'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
          {description}
        </p>
      )}
      {children}
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
