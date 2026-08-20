export interface PageSemantics {
  imageAltText: Record<string, string>;
  demoteSecondH1: boolean;
}

export const pageSemanticsBySource: Readonly<Record<string, PageSemantics>>;

export function getPageSemantics(source: string): PageSemantics;

export function applyPageSemantics(markup: string, semantics: PageSemantics): string;

export function enhanceAccessibility(html: string): string;