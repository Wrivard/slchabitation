/**
 * Attributs hérités de l'export Webflow.
 *
 * Les pages du site portent quelques attributs que les scripts de Webflow
 * lisent au chargement — la durée d'un compteur animé, par exemple. Ils ne
 * font partie d'aucun standard HTML : ils sont déclarés ici pour que le
 * balisage converti reste vérifiable par TypeScript, sans être réécrit.
 */
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    /** Durée, en millisecondes, de l'animation d'un compteur Webflow. */
    duration?: string;
  }
}
