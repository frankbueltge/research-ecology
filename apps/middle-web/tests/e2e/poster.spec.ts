import { expect, test } from "@playwright/test";

/** Work order phase-3d §4 "Poster-Performance": `/` is SSR (the headline is already in the
 * response body, not injected by client JS), its Largest Contentful Paint element is the
 * headline text (not an image — there is no `<img>` on this page at all, and the glyph is
 * inline SVG, never treated as the page's LCP resource), and the page makes no requests to any
 * other origin (self-hosted fonts, no analytics, no third-party scripts — work order-wide
 * rule, re-checked here for the new entrance specifically). */
test.describe("poster performance", () => {
  test("/ is SSR: the headline text is present in the raw response body", async ({ request }) => {
    const response = await request.get("/");
    const body = await response.text();
    expect(response.status()).toBe(200);
    expect(body).toContain("A work found the flaw in the instrument it was built from.");
  });

  test("/ makes no requests to any origin other than its own", async ({ page, baseURL }) => {
    const foreignRequests: string[] = [];
    page.on("request", (req) => {
      const url = new URL(req.url());
      if (baseURL && url.origin !== new URL(baseURL).origin) {
        foreignRequests.push(req.url());
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(foreignRequests, JSON.stringify(foreignRequests)).toEqual([]);
  });

  test("/ Largest Contentful Paint element is text, not an image resource", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const lcp = await page.evaluate(
      () =>
        new Promise<{ url: string; size: number } | null>((resolve) => {
          try {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const last = entries[entries.length - 1] as (PerformanceEntry & { url?: string; size?: number }) | undefined;
              if (last) resolve({ url: last.url ?? "", size: last.size ?? 0 });
            });
            observer.observe({ type: "largest-contentful-paint", buffered: true });
            // Resolve with null if no LCP entry ever fires (should not happen, but avoids a hang).
            setTimeout(() => resolve(null), 2000);
          } catch {
            resolve(null);
          }
        })
    );
    expect(lcp).not.toBeNull();
    // Image-based LCP entries carry a non-empty `url`; text-node LCP entries do not.
    expect(lcp?.url).toBe("");
  });
});
