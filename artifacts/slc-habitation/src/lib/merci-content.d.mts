export type MerciImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const merciHero: {
  kicker: string;
  title: string;
  intro: string;
  image: MerciImage;
};

export const merciStepsTitle: string;

export const merciSteps: { title: string; text: string }[];

export const merciContactTitle: string;

export const merciContacts: {
  label: string;
  href: string;
  testId: string;
  kind: string;
}[];

export const merciLinks: { label: string; href: string; testId: string }[];

export function merciServiceNote(serviceLabel: string): string;
