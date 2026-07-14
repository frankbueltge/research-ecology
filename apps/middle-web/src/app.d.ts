import type { Locale } from "$lib/i18n";

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {
      locale: Locale;
      /** "light" | "dark" | undefined (undefined ⇒ follow prefers-color-scheme, no cookie set yet). */
      theme: "light" | "dark" | undefined;
    }
  }
}

export {};
