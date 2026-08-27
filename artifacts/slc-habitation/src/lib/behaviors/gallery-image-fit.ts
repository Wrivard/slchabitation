/**
 * Cadrage des photos de réalisations.
 *
 * Les photos de la galerie viennent d'appareils différents : sans cadrage
 * imposé, certaines s'affichent de travers ou débordent de leur vignette. La
 * page héritée corrigeait cela par un script inline qui force, sur chaque
 * photo, le recadrage « couvrant », l'absence de rotation issue des données
 * EXIF, et le format 16/9 de la vignette. Ces réglages sont repris ici à
 * l'identique — y compris leur priorité `!important`, indispensable pour
 * passer devant les règles de la feuille de style héritée.
 *
 * La page d'origine tentait aussi de rattraper une photo optimisée manquante
 * en revenant au fichier original ; ce rattrapage est conservé.
 */

const IMAGE_SELECTOR = '.blog22_image';
const WRAPPER_SELECTOR = '.blog22_image-wrapper';

const IMAGE_STYLES: Array<[string, string]> = [
  ['object-fit', 'cover'],
  ['object-position', 'center center'],
  ['width', '100%'],
  ['height', '100%'],
  ['min-width', '100%'],
  ['min-height', '100%'],
  ['max-width', '100%'],
  ['max-height', '100%'],
  ['display', 'block'],
  ['transform', 'rotate(0deg)'],
  ['-webkit-transform', 'rotate(0deg)'],
  ['-moz-transform', 'rotate(0deg)'],
  ['-ms-transform', 'rotate(0deg)'],
  ['image-orientation', 'from-image 0deg'],
  ['-webkit-image-orientation', 'from-image 0deg'],
];

const WRAPPER_STYLES: Array<[string, string]> = [
  ['aspect-ratio', '16 / 9'],
  ['overflow', 'hidden'],
  ['position', 'relative'],
];

/* Fichiers redimensionnés par Webflow : « photo-p-800.jpg » vient de
   « photo.jpg ». */
const RESIZED_FILE = /-p-\d+\.(jpg|jpeg|png)/i;

function originalFile(url: string): string {
  const withoutSize = url.replace(RESIZED_FILE, '.$1');
  return withoutSize === url ? url.replace(/-p-\d+/, '') : withoutSize;
}

function forceStyles(element: HTMLElement, styles: Array<[string, string]>) {
  for (const [property, value] of styles) {
    element.style.setProperty(property, value, 'important');
  }
}

export function applyGalleryImageFit(container: HTMLElement): () => void {
  const images = Array.from(container.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR));
  const cleanups: Array<() => void> = [];

  for (const image of images) {
    forceStyles(image, IMAGE_STYLES);

    const wrapper = image.closest<HTMLElement>(WRAPPER_SELECTOR);
    if (wrapper) forceStyles(wrapper, WRAPPER_STYLES);

    const handleError = () => {
      const source = image.getAttribute('srcset');
      if (image.src.includes('-p-')) image.src = originalFile(image.src);
      if (source?.includes('-p-')) {
        image.setAttribute('srcset', source.replace(new RegExp(RESIZED_FILE, 'gi'), '.$1'));
      }
    };

    image.addEventListener('error', handleError);
    cleanups.push(() => image.removeEventListener('error', handleError));

    /* Le navigateur doit toujours pouvoir retomber sur le fichier d'origine,
       même si aucune taille intermédiaire n'existe. */
    const srcset = image.getAttribute('srcset');
    if (srcset?.includes('-p-') && !srcset.split(',').some((part) => !part.includes('-p-'))) {
      const firstEntry = srcset.split(',')[0].trim().split(' ')[0];
      const original = originalFile(firstEntry);
      if (original !== firstEntry) {
        image.setAttribute('srcset', `${srcset}, ${original} 2560w`);
      }
    }
  }

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
