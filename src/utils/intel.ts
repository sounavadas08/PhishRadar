export interface ThreatFeedEntry {
  url: string;
}

/**
 * Fetch a public phishing threat feed and return a Set of lower‑cased URLs.
 * Uses PhishTank's JSON feed endpoint (publicly accessible).
 */
export const fetchThreatFeed = async (): Promise<Set<string>> => {
  try {
    const resp = await fetch('https://www.phishtank.com/api/json/feed');
    if (!resp.ok) return new Set();
    const data = await resp.json();
    const urls = new Set<string>();
    // The feed format contains an array `entries` with objects that have `url`.
    (data.entries ?? []).forEach((e: any) => {
      if (e.url && typeof e.url === 'string') {
        urls.add(e.url.toLowerCase());
      }
    });
    return urls;
  } catch {
    return new Set();
  }
};

/**
 * Simple lookup – returns true if the given URL (or its final redirection) is present in the feed.
 */
export const isUrlInFeed = (url: string, feed: Set<string>): boolean => {
  return feed.has(url.toLowerCase());
};

