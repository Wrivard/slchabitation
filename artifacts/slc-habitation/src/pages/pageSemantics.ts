type ImageAltText = Record<string, string>;

/**
 * Adds meaningful alternative text to the legacy HTML exports before React
 * inserts them into the document. The exports are intentionally kept intact
 * because they include the original page markup and scripts.
 */
export function applyPageSemantics(
  markup: string,
  imageAltText: ImageAltText,
  demoteSecondH1 = false,
) {
  let enhancedMarkup = markup.replace(/<img\b[^>]*>/gi, (imageTag) => {
    const source = imageTag.match(/\bsrc="([^"]+)"/i)?.[1];
    const altText = source ? imageAltText[source] : undefined;

    if (!altText) {
      return imageTag;
    }

    return /\balt="[^"]*"/i.test(imageTag)
      ? imageTag.replace(/\balt="[^"]*"/i, `alt="${altText}"`)
      : imageTag.replace(/<img\b/i, `<img alt="${altText}"`);
  });

  if (!demoteSecondH1) {
    return enhancedMarkup;
  }

  let h1Count = 0;
  enhancedMarkup = enhancedMarkup.replace(
    /<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi,
    (heading, attributes, contents) => {
      h1Count += 1;
      return h1Count === 2 ? `<h2${attributes}>${contents}</h2>` : heading;
    },
  );

  return enhancedMarkup;
}