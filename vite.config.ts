
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Définir les variables d'environnement par défaut si nécessaire
  define: {
    // S'assurer que les variables d'environnement sont correctement définies
    'import.meta.env.VITE_TMDB_API_BASE_URL': JSON.stringify(process.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3'),
    'import.meta.env.VITE_TMDB_API_KEY': JSON.stringify(process.env.VITE_TMDB_API_KEY || ''),
    'import.meta.env.VITE_TMDB_API_TOKEN': JSON.stringify(process.env.VITE_TMDB_API_TOKEN || '')
  }
}));
