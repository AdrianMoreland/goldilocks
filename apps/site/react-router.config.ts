import type { Config } from "@react-router/dev/config";

// Static output: every page without URL parameters is rendered to HTML at build time (ADR 0002).
// Live prices are fetched in the browser, so no server runs in production.
export default {
  ssr: false,
  prerender: true,
} satisfies Config;
