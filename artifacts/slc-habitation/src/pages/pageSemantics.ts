import {
  applyPageSemantics as applySharedPageSemantics,
  getPageSemantics,
} from '../lib/publicPageSemantics.mjs';

type ImageAltText = Record<string, string>;

/**
 * Adds meaningful alternative text to the legacy HTML exports before React
 * inserts them into the document. The export delegates to the same portable
 * transform used by the production prerenderer.
 */
export function applyPageSemantics(
  markup: string,
  imageAltText: ImageAltText,
  demoteSecondH1 = false,
) {
  return applySharedPageSemantics(markup, {
    imageAltText,
    demoteSecondH1,
  });
}

export { getPageSemantics };
