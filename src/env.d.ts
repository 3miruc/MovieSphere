
/// <reference types="vite/client" />

/**
 * Déclaration de type pour les variables d'environnement de Vite
 */
interface ImportMetaEnv {
  // Variables d'environnement TMDB
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_TMDB_API_BASE_URL: string;
  readonly VITE_TMDB_API_TOKEN: string;
  // Ajouter d'autres variables d'environnement au besoin
}

/**
 * Extension de l'interface ImportMeta pour y inclure la propriété env
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
